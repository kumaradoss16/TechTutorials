let allPalettes = window.PALETTES_DATA.palettes;

document.addEventListener("DOMContentLoaded", () => {
    // Typewriter effect
    (function () {
        const el = document.getElementById("brand");
        if (!el) return;
        
        const text = el.dataset.text || "DevSpire";
        let i = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;
        const restartPause = 500;

        function typeLoop() {
            const currentText = text.slice(0, i);
            el.textContent = currentText;

            if (!isDeleting && i < text.length) {
                i++;
                setTimeout(typeLoop, typeSpeed);
            } else if (!isDeleting && i === text.length) {
                isDeleting = true;
                setTimeout(typeLoop, pauseTime);
            } else if (isDeleting && i > 0) {
                i--;
                setTimeout(typeLoop, deleteSpeed);
            } else if (isDeleting && i === 0) {
                isDeleting = false;
                setTimeout(typeLoop, restartPause);
            }
        }
        typeLoop();
    })();

    // Scroll to top with progress
    const scrollBtn = document.getElementById("scrollUpBtn");
    if (scrollBtn) {
        const circle = scrollBtn.querySelector(".progress-circle .progress");
        const circumference = 2 * Math.PI * 15.9155;

        if (circle) {
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        }

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            if (circle) {
                const offset = circumference * (1 - scrollPercent);
                circle.style.strokeDashoffset = offset;
            }

            scrollBtn.style.display = scrollTop > 100 ? "block" : "none";
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ✅ HTML escape function
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ✅ UPDATED: renderGrid with 10-color support
    function renderGrid() {
        const grid = document.getElementById('paletteGrid');
        if (!grid) {
            console.error("Element with id 'paletteGrid' not found!");
            return;
        }

        if (!allPalettes || allPalettes.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No palettes available.</div>';
            return;
        }

        grid.innerHTML = allPalettes.map(p => `
            <div class="palette-card ${p.colors.length === 10 ? 'palette-card--wide' : ''}" data-palette-id="${p.id}" role="button" tabindex="0" aria-label="View ${escapeHtml(p.name)} palette">
                <div class="color-wave ${p.colors.length === 10 ? 'color-wave--wide' : 'colors-' + p.colors.length}">
                    ${p.colors.map(c => `
                        <div class="wave-bar" 
                             style="background-color: ${c}" 
                             data-color="${c}">
                        </div>
                    `).join('')}
                </div>
                <div class="card-info">
                    <div class="card-header">
                        <div class="card-title">${escapeHtml(p.name)}</div>
                    </div>
                    <div class="card-tags">
                        ${p.tags.map(tag => `<div class="tag">${escapeHtml(tag)}</div>`).join('')}
                        <div class="tag">${p.colors.length} colors</div>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn copy-all-btn" data-colors="${p.colors.join(' ')}">Copy All</button>
                        <button class="card-btn view-btn">View</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Event delegation
        grid.addEventListener('click', handleGridClick);
        grid.addEventListener('keydown', handleGridKeydown);
    }

    // Event handler for grid
    function handleGridClick(e) {
        const waveBar = e.target.closest('.wave-bar');
        if (waveBar) {
            e.stopPropagation();
            copyColor(waveBar.dataset.color, e);
            return;
        }

        const copyAllBtn = e.target.closest('.copy-all-btn');
        if (copyAllBtn) {
            e.stopPropagation();
            copyColor(copyAllBtn.dataset.colors, e);
            return;
        }

        const card = e.target.closest('[data-palette-id]');
        if (card) {
            openModal(parseInt(card.dataset.paletteId));
        }
    }

    // Keyboard navigation
    function handleGridKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('[data-palette-id]');
            if (card) {
                e.preventDefault();
                openModal(parseInt(card.dataset.paletteId));
            }
        }
    }

    // Open modal
    function openModal(id) {
        try {
            const p = allPalettes.find(item => item.id === id);
            if (!p) {
                console.error(`Palette with id ${id} not found`);
                return;
            }

            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');

            if (!modal || !modalTitle || !modalContent) {
                console.error('Modal elements not found');
                return;
            }

            modalTitle.textContent = p.name;
            const paletteName = p.name.toLowerCase().replace(/\s+/g, '-');

            // Generate export formats
            const cssVars = p.colors.map((c, i) => `  --${paletteName}-${i + 1}: ${c};`).join('\n');
            const cssCode = `:root {\n${cssVars}\n}`;

            const jsonTokens = JSON.stringify({
                [p.name]: p.colors.reduce((acc, color, i) => {
                    acc[`color-${i + 1}`] = color;
                    return acc;
                }, {})
            }, null, 2);

            const figmaTokens = JSON.stringify({
                [p.name]: p.colors.reduce((acc, color, i) => {
                    acc[`${paletteName}-${i + 1}`] = {
                        value: color,
                        type: "color"
                    };
                    return acc;
                }, {})
            }, null, 2);

            const scssVars = p.colors.map((c, i) => `$${paletteName}-${i + 1}: ${c};`).join('\n');

            const tailwindConfig = `module.exports = {
  theme: {
    extend: {
      colors: {
        '${paletteName}': {
${p.colors.map((c, i) => `          ${(i + 1) * 100}: '${c}',`).join('\n')}
        }
      }
    }
  }
}`;

            modalContent.innerHTML = `
                <div class="color-showcase">
                    ${p.colors.map(c => `
                        <div class="showcase-item" 
                             style="background-color: ${c}" 
                             data-color="${c}"
                             role="button"
                             tabindex="0"
                             aria-label="Copy color ${c}">
                            <div class="showcase-label">${c}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="export-section">
                    <div class="export-title">Export Formats</div>
                    <div class="export-formats">
                        ${generateFormatBlock('CSS Variables', cssCode)}
                        ${generateFormatBlock('JSON Design Tokens', jsonTokens)}
                        ${generateFormatBlock('Figma Variables', figmaTokens)}
                        ${generateFormatBlock('SCSS Variables', scssVars)}
                        ${generateFormatBlock('Tailwind Config', tailwindConfig)}
                    </div>
                </div>
            `;

            // Add event listeners
            modalContent.querySelectorAll('.showcase-item').forEach(item => {
                item.addEventListener('click', (e) => copyColor(item.dataset.color, e));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        copyColor(item.dataset.color, e);
                    }
                });
            });

            modalContent.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const code = btn.previousElementSibling.textContent;
                    copyColor(code, e);
                });
            });

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            modal.querySelector('.modal-close')?.focus();

        } catch (error) {
            console.error('Error opening modal:', error);
            document.body.style.overflow = 'auto';
        }
    }

    // Helper for format blocks
    function generateFormatBlock(name, code) {
        return `
            <div class="format-block">
                <div class="format-header">
                    <div class="format-name">${escapeHtml(name)}</div>
                </div>
                <div class="code-display">${escapeHtml(code)}</div>
                <button class="copy-btn">Copy ${escapeHtml(name)}</button>
            </div>
        `;
    }

    // Close modal
    function closeModal() {
        try {
            const modal = document.getElementById('modal');
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('Error closing modal:', error);
            document.body.style.overflow = 'auto';
        }
    }

    // Copy with fallback
    function copyColor(text, event) {
        if (event) event.stopPropagation();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => showToast())
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopy(text);
                });
        } else {
            fallbackCopy(text);
        }
    }

    // Fallback copy
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textarea);
    }

    // Show toast
    function showToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        }
    }

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Global functions
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.copyColor = copyColor;

    // Initialize
    renderGrid();
});

