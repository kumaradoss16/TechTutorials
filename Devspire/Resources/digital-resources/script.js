document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.getElementById("scrollUpBtn");
  const circle = document.querySelector("#scrollUpBtn .progress");

  // Circumference for SVG circle with r=16 (adjust if needed)
  const circumference = 2 * Math.PI * 16;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Animate progress circle
    if (circle) {
      const offset = circumference * (1 - scrollPercent);
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${offset}`;
    }

    // Show/hide button after scrolling 300px
    if (scrollBtn) {
      scrollBtn.style.display = scrollTop > 300 ? "block" : "none";
    }
  });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  
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

    const tabButtons = document.querySelectorAll('.tab-button');
    const projectCards = document.querySelectorAll('.resource-card');

    const languageMap = {
    'Programming': ['programming'],
    'Hacking': ['hacking'],
    'Networking': ['networking'],
    'AI': ['ai'],
    'all': []
    };

    function filterProjects(selectedLanguage) {
    const languagesToShow = languageMap[selectedLanguage];
    let visibleCount = 0;

    projectCards.forEach(card => {
        let shouldShow = false;

        if (selectedLanguage === 'all') {
        shouldShow = true;
        } else {
        // Check if card has any of the required language classes
        shouldShow = languagesToShow.some(lang => card.classList.contains(lang));
        }

        if (shouldShow) {
        // Remove hidden-project class if present
        card.classList.remove('hidden-project');
        card.style.display = 'flex';
        visibleCount++;
        } else {
        card.style.display = 'none';
        }
    });

    console.log(`Visible cards for ${selectedLanguage}: ${visibleCount}`);
    }

    if (tabButtons.length > 0 && projectCards.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get selected language
        const selectedLanguage = button.getAttribute('data-lang');
        
        // Filter projects
        filterProjects(selectedLanguage);
        
        console.log(`Filtered projects by: ${selectedLanguage}`);
        });
    });

    // Set initial filter on page load
    const activeTab = document.querySelector('tab-button.active');
    if (activeTab) {
        const initialLanguage = activeTab.getAttribute('data-lang');
        filterProjects(initialLanguage);
    }
    }

});


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".download-btn");
  if (!btn) return;

  const filePath = btn.dataset.file;
  if (!filePath) {
    console.error("Download failed: no file path defined.");
    return;
  }

  downloadFile(filePath);
});

function downloadFile(filePath) {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = filePath.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
