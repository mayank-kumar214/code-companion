document.addEventListener('DOMContentLoaded', loadHistory);

// --- GLOBAL STATE ---
let currentProjectFolder = null;

// --- GENERATION LOGIC ---
async function generateProject() {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');

    // Status Elements
    const statusContainer = document.getElementById('statusContainer');
    const statusPhase = document.getElementById('statusPhase');
    const statusDetails = document.getElementById('statusDetails');
    const progressBar = document.getElementById('progressBar');

    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Please enter a description");

    // Reset UI
    generateBtn.disabled = true;
    statusContainer.classList.remove('hidden');
    document.getElementById('liveProjectArea').classList.add('hidden'); // Hide previous result
    progressBar.style.width = '5%';

    try {
        const response = await fetch('/generate-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (!line.trim()) continue;

                try {
                    const data = JSON.parse(line);

                    // Update Status UI
                    if(data.phase !== 'error') {
                        statusPhase.textContent = data.message;
                        if(data.details) statusDetails.textContent = data.details;
                    }

                    // Handle Phases
                    switch(data.phase) {
                        case 'planning':
                            progressBar.style.width = '25%';
                            break;
                        case 'architect':
                            progressBar.style.width = '50%';
                            break;
                        case 'coding':
                            progressBar.style.width = '75%';
                            break;
                        case 'complete':
                            progressBar.style.width = '100%';
                            await handleGenerationComplete(data);
                            break;
                        case 'error':
                            alert("Error: " + data.message);
                            break;
                    }
                } catch (e) {
                    console.error("JSON Parse Error", e);
                }
            }
        }

    } catch (error) {
        console.error(error);
        statusPhase.textContent = "Connection Error";
    } finally {
        generateBtn.disabled = false;
        setTimeout(() => {
            statusContainer.classList.add('hidden');
            progressBar.style.width = '0%';
        }, 3000);
    }
}

async function handleGenerationComplete(data) {
    const rawPath = data.project_path;
    // Extract folder name from path
    currentProjectFolder = rawPath.replace(/[/\\]$/, '').split(/[/\\]/).pop();

    // 1. Refresh History
    await loadHistory();

    // 2. Load Project in Live View
    // Create a mock object so we can reuse the activate logic
    const projMock = {
        name: data.project_name,
        folder: currentProjectFolder
    };
    activateProject(projMock);
}

function refreshPreview() {
    const frame = document.getElementById('previewFrame');
    if (!currentProjectFolder) return;
    // Add random query param to force reload
    frame.src = `/projects/${currentProjectFolder}/index.html?t=${new Date().getTime()}`;
}

async function loadProjectFiles(folder) {
    const res = await fetch(`/project-files?folder=${folder}`);
    const files = await res.json();

    const tabsContainer = document.getElementById('codeTabs');
    const codeContent = document.getElementById('codeContent');

    tabsContainer.innerHTML = '';

    if (files.length === 0) {
        codeContent.textContent = "// No readable files found.";
        return;
    }

    // Sort files: HTML first, then CSS, JS, then others
    const priority = { 'html': 1, 'css': 2, 'js': 3 };
    files.sort((a, b) => (priority[a.language] || 99) - (priority[b.language] || 99));

    // Create Tabs
    files.forEach((file, index) => {
        const tab = document.createElement('button');
        tab.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        tab.textContent = file.name;
        tab.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tab.classList.add('active');
            codeContent.textContent = file.content;
        };
        tabsContainer.appendChild(tab);
    });

    // Set initial content
    codeContent.textContent = files[0].content;
}

// --- TAB SWITCHING (Preview vs Code) ---
function switchView(view) {
    const previewContainer = document.getElementById('viewPreview');
    const codeContainer = document.getElementById('viewCode');
    const btnPreview = document.getElementById('btnViewPreview');
    const btnCode = document.getElementById('btnViewCode');

    if (view === 'preview') {
        previewContainer.classList.remove('hidden');
        codeContainer.classList.add('hidden');
        btnPreview.classList.add('active');
        btnCode.classList.remove('active');
    } else {
        previewContainer.classList.add('hidden');
        codeContainer.classList.remove('hidden');
        btnPreview.classList.remove('active');
        btnCode.classList.add('active');
    }
}

// --- CLOSE PROJECT ---
function closeProject() {
    const liveArea = document.getElementById('liveProjectArea');
    liveArea.classList.add('hidden');

    // Optional: Reset iframe to stop audio/video
    document.getElementById('previewFrame').src = '';
    currentProjectFolder = null;
}

// --- HISTORY LOGIC ---
async function loadHistory() {
    const container = document.getElementById('projectCards');
    try {
        const res = await fetch('/history');
        const projects = await res.json();

        container.innerHTML = '';
        if (!projects || projects.length === 0) {
            container.innerHTML = '<p class="empty-msg">No projects yet.</p>';
            return;
        }

        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const dateStr = new Date(proj.created * 1000).toLocaleDateString();
            const projectUrl = `/projects/${proj.folder}/index.html`;

            card.innerHTML = `
                <div class="card-preview">
                    <iframe src="${projectUrl}" class="thumbnail-frame" loading="lazy" scrolling="no"></iframe>
                    <div class="card-overlay"></div>
                </div>
                <div class="card-info">
                    <div class="card-title">${proj.name}</div>

                    <div class="card-footer">
                        <div class="card-date">${dateStr}</div>
                        <div class="card-actions">
                            <button class="mini-btn btn-load" title="Edit / Preview">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>

                            <a href="${projectUrl}" target="_blank" class="mini-btn btn-newtab" title="Open in New Tab">
                                <i class="fa-solid fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            // 1. Click on the whole card loads the project (standard behavior)
            card.onclick = () => activateProject(proj);

            // 2. Click on "Edit/Preview" button
            const loadBtn = card.querySelector('.btn-load');
            loadBtn.onclick = (e) => {
                e.stopPropagation(); // Prevent double-firing
                activateProject(proj);
            };

            // 3. Click on "New Tab" button
            const newTabBtn = card.querySelector('.btn-newtab');
            newTabBtn.onclick = (e) => {
                e.stopPropagation(); // Prevents the page from scrolling up to the editor
            };

            container.appendChild(card);
        });
    } catch (e) {
        console.error("Failed history", e);
    }
}

// Helper: Loads project into the main view
function activateProject(proj) {
    currentProjectFolder = proj.folder;
    document.getElementById('liveProjectName').textContent = proj.name;
    const liveArea = document.getElementById('liveProjectArea');

    liveArea.classList.remove('hidden');

    refreshPreview();
    loadProjectFiles(proj.folder);

    // Scroll specifically to the Live Area (with top margin)
    liveArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}