document.addEventListener("DOMContentLoaded", () => {
    (function () {
        const el = document.getElementById("brand");
        const text = el.dataset.text || "DevSpire";
        let i = 0;
        let isDeleting = false;

        const typeSpeed = 100;    // typing speed (ms)
        const deleteSpeed = 50;   // deleting speed (ms)
        const pauseTime = 2000;   // pause at end before deleting (ms)
        const restartPause = 500; // pause before restarting (ms)

        function typeLoop() {
            const currentText = text.slice(0, i);
            el.textContent = currentText;

            if (!isDeleting && i < text.length) {
                // Typing forward
                i++;
                setTimeout(typeLoop, typeSpeed);
            } else if (!isDeleting && i === text.length) {
                // Finished typing, pause then start deleting
                isDeleting = true;
                setTimeout(typeLoop, pauseTime);
            } else if (isDeleting && i > 0) {
                // Deleting
                i--;
                setTimeout(typeLoop, deleteSpeed);
            } else if (isDeleting && i === 0) {
                // Finished deleting, restart
                isDeleting = false;
                setTimeout(typeLoop, restartPause);
            }
        }

        typeLoop();
    })();

    // --- Navbar Functionality ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // REFACTOR: Create a single function to control the menu state (open/closed)
        const setMenuState = (isOpen) => {
            const icon = menuToggle.querySelector('i');
            if (isOpen) {
                navLinks.classList.add('active');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                navLinks.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        // 1. Handle clicks on the menu toggle button
        menuToggle.addEventListener('click', () => {
            // Toggle based on the current state
            const isActive = navLinks.classList.contains('active');
            setMenuState(!isActive);
        });

        // 2. Handle clicks outside the menu to close it
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            // Only close if it's currently open and the click is outside
            if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
                setMenuState(false); // Explicitly close the menu
            }
        });
    } else {
        console.warn("Menu toggle or nav links not found. Mobile menu functionality will not work.");
    }


    // --- Code Snippet Copy Functionality ---
    const copyTerminalConfigs = [
        { btnId: 'copyCodeBtnPython', snippetId: 'codeSnippetPython', feedbackId: 'copyFeedbackPython' }
    ];

    // Function to handle copying (reusable)
    function setupCopyFunctionality(button, snippet, feedback) {
        button.addEventListener('click', () => {
            const textToCopy = snippet.textContent;

            // Using the modern Clipboard API is preferred for security and simplicity,
            // with execCommand as a robust fallback.
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    feedback.textContent = 'Copied!';
                    feedback.classList.add('show');
                }).catch(err => {
                    console.error('Clipboard API failed: ', err);
                    feedback.textContent = 'Failed to copy.';
                    feedback.classList.add('show', 'error');
                });
            } else {
                // Fallback for older browsers or insecure contexts
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = 0;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    feedback.textContent = 'Copied!';
                    feedback.classList.add('show');
                } catch (err) {
                    console.error('execCommand failed: ', err);
                    feedback.textContent = 'Failed to copy.';
                    feedback.classList.add('show', 'error');
                }
                document.body.removeChild(textarea);
            }

            setTimeout(() => {
                feedback.classList.remove('show', 'error');
            }, 2000);
        });
    }

    // OPTIMIZATION: Find elements and filter out any that don't exist on the page
    copyTerminalConfigs.forEach(config => {
        const button = document.getElementById(config.btnId);
        const snippet = document.getElementById(config.snippetId);
        const feedback = document.getElementById(config.feedbackId);

        // Only set up the listener if all three elements were found
        if (button && snippet && feedback) {
            setupCopyFunctionality(button, snippet, feedback);
        }
    });

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const circle = document.querySelector(".progress-circle .progress");
        circle.style.strokeDasharray = `${scrollPercent}, 100`;

        const scrollBtn = document.getElementById("scrollUpBtn");
        scrollBtn.style.display = scrollTop > 100 ? "block" : "none";

        document.getElementById("scrollUpBtn").addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });

    // --- Scroll to top with progress indicator ---
    const scrollBtn = document.getElementById("scrollUpBtn");
  if (!scrollBtn) return;

  const circle = scrollBtn.querySelector(".progress");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight <= 0) return;

    const progress = scrollTop / docHeight;
    const offset = circumference * (1 - progress);

    circle.style.strokeDashoffset = offset;

    scrollBtn.classList.toggle("show", scrollTop > 100);
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress(); // 👈 critical for reloads

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

function downloadProject(filename = "project.rar", filePath = "Download/project.rar") {
    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filename;

    // Append to the document, trigger click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadAllImages(filename = "assets.rar", filePath = "Download/assets.rar") {
    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filename;

    // Append to the document, trigger click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

