document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const optionsBtn = document.getElementById('optionsBtn');
    const optionsDropdown = document.getElementById('optionsDropdown');
    const submitBtn = document.getElementById('submitBtn');
    const promptInput = document.getElementById('promptInput');
    const historyList = document.getElementById('historyList');
    const historySidebar = document.getElementById('historySidebar');
    const clock = document.getElementById('clock');

    // File input elements
    const pdfInput = document.getElementById('pdfInput');
    const videoInput = document.getElementById('videoInput');
    const audioInput = document.getElementById('audioInput');
    const folderInput = document.getElementById('folderInput');

    // Toggle options dropdown
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!optionsBtn.contains(e.target) && !optionsDropdown.contains(e.target)) {
            optionsDropdown.classList.remove('show');
        }
    });

    // Handle option selection
    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = option.dataset.type;
            handleOptionSelect(type);
            optionsDropdown.classList.remove('show');
        });
    });

    // Option selection handler
    function handleOptionSelect(type) {
        const typeActions = {
            pdf: () => pdfInput.click(),
            folder: () => folderInput.click(),
            video: () => videoInput.click(),
            github: () => promptForUrl('Enter GitHub Repository URL'),
            audio: () => audioInput.click(),
            youtube: () => promptForUrl('Enter YouTube Video URL')
        };

        if (typeActions[type]) {
            typeActions[type]();
        }
    }

    // File input event listeners
    pdfInput.addEventListener('change', (e) => handleFileSelect(e, 'PDF'));
    videoInput.addEventListener('change', (e) => handleFileSelect(e, 'Video'));
    audioInput.addEventListener('change', (e) => handleFileSelect(e, 'Audio'));
    folderInput.addEventListener('change', (e) => handleFileSelect(e, 'Folder'));

    // Handle file selection
    function handleFileSelect(event, type) {
        const files = event.target.files;
        if (files.length > 0) {
            if (type === 'Folder') {
                const fileList = Array.from(files)
                    .map(file => file.name)
                    .join(', ');
                promptInput.value = `Selected ${type}: ${fileList}`;
                addToHistory(`Folder selected with ${files.length} files`);
            } else {
                const file = files[0];
                promptInput.value = `Selected ${type}: ${file.name}`;
                addToHistory(`${type} file selected: ${file.name}`);
            }
            // Reset file input
            event.target.value = '';
        }
    }

    // Handle URL prompts
    function promptForUrl(message) {
        const url = prompt(message);
        if (url && url.trim()) {
            promptInput.value = url.trim();
            addToHistory(`URL added: ${url.trim()}`);
            return true;
        }
        return false;
    }

    // Submit prompt
    submitBtn.addEventListener('click', handleSubmit);
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });

    function handleSubmit() {
        const prompt = promptInput.value.trim();
        if (prompt) {
            addToHistory(`Prompt: ${prompt}`);
            promptInput.value = '';
        }
    }

    // History sidebar toggle
    document.addEventListener('mousemove', (e) => {
        if (e.clientX < 20) {
            historySidebar.classList.add('show');
        } else if (e.clientX > 320) {
            historySidebar.classList.remove('show');
        }
    });

    // Add to history
    function addToHistory(text) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-time">${new Date().toLocaleTimeString()}</div>
            <div class="history-text">${text}</div>
        `;
        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    // Update clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Initialize clock
    setInterval(updateClock, 1000);
    updateClock();
});