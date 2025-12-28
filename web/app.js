document.addEventListener('DOMContentLoaded', loadHistory);

// --- GALLERY & HISTORY LOGIC ---
async function loadHistory() {
    const container = document.getElementById('projectCards');

    try {
        const res = await fetch('/history');
        const projects = await res.json();

        container.innerHTML = '';

        if (!projects || projects.length === 0) {
            container.innerHTML = '<p style="color: #666; grid-column: 1/-1; text-align: center;">No projects yet. Start building!</p>';
            return;
        }

        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const dateStr = new Date(proj.created * 1000).toLocaleDateString();

            // Construct the thumbnail/preview URL
            const projectUrl = `/projects/${proj.folder}/index.html`;

            // Thumbnail (iframe) + Info
            card.innerHTML = `
                <div class="card-preview">
                    <iframe src="${projectUrl}" class="thumbnail-frame" loading="lazy" scrolling="no"></iframe>
                    <div class="card-overlay"></div>
                </div>
                <div class="card-info">
                    <div class="card-title">${proj.name}</div>
                    <div class="card-date">${dateStr}</div>
                </div>
            `;

            // CLICK ACTION: Open in New Tab
            card.onclick = () => {
                window.open(projectUrl, '_blank');
            };

            container.appendChild(card);
        });

    } catch (e) {
        console.error("Failed to load history:", e);
        container.innerHTML = '<p style="color: #ef4444;">Failed to load history.</p>';
    }
}

// --- GENERATION LOGIC ---
async function generateProject() {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');
    const errorArea = document.getElementById('errorArea');

    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Please enter a description");

    generateBtn.disabled = true;
    loader.classList.remove('hidden');
    errorArea.classList.add('hidden');

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Server Error');

        // Refresh Gallery
        await loadHistory();

        // OPEN IN NEW TAB IMMEDIATELY
        const rawPath = data.project_path;
        const folderName = rawPath.replace(/[/\\]$/, '').split(/[/\\]/).pop();

        // Add timestamp to ensure fresh load
        const projectUrl = `/projects/${folderName}/index.html?t=${new Date().getTime()}`;
        window.open(projectUrl, '_blank');

    } catch (error) {
        console.error(error);
        document.getElementById('errorMessage').textContent = error.message;
        errorArea.classList.remove('hidden');
    } finally {
        generateBtn.disabled = false;
        loader.classList.add('hidden');
    }
}