document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    (function () {
        const el = document.getElementById("brand");
        const text = el.dataset.text || "DevSpireHub";
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

    // Project filtering logic 
    // Project filtering logic
const tabButtons = document.querySelectorAll('.tab-button');
const projectCards = document.querySelectorAll('.project-card');

const languageMap = {
  'HTML CSS': ['html', 'css'],
  'JavaScript': ['html', 'css', 'javascript'],
  'Python': ['python', 'pygame'],
  'C': ['c'],
  'C++': ['cpp'],
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


    function setupViewAllToggle(buttonId, hiddenClassName, showClass, initialButtonText, toggleButtonText) {
        const viewAllBtn = document.getElementById(buttonId);
        if (!viewAllBtn) return;
        const hiddenCards = document.querySelectorAll(`.${hiddenClassName}`);
        let allCardsVisible = false;     // Toggle the state
        viewAllBtn.textContent = initialButtonText;

        viewAllBtn.addEventListener("click", () => {
            if (!allCardsVisible) {
                hiddenCards.forEach(card => {
                    card.classList.remove(hiddenClassName);
                    card.classList.add(showClass);
                })
                viewAllBtn.textContent = toggleButtonText;
            } else {
                hiddenCards.forEach(card => {
                    card.classList.remove(showClass);
                    card.classList.add(hiddenClassName);
                })
                viewAllBtn.textContent = initialButtonText;
            }
            allCardsVisible = !allCardsVisible;     // Toggle the state
        });
    }

    setupViewAllToggle(
        'view-all-btn-projects',
        'hidden-project', // Pass only the class name 'hidden-project'
        'show-project',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-programming',
        'hidden-programming', // Pass only the class name 'hidden-programming'
        'show-programming',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-hacking-series',
        'hidden-hacking', // Pass only the class name 'hidden-project'
        'show-hacking',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-hacking-tutorial',
        'hidden-hacking-tutorial', // Pass only the class name 'hidden-project'
        'show-hacking-tutorial',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-networking',
        'hidden-networking', // Pass only the class name 'hidden-project'
        'show-networking',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-automation-tutorial',
        'hidden-automation-tutorial', // Pass only the class name 'hidden-project'
        'show-automation-tutorial',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-automation-project',
        'hidden-automation-project', // Pass only the class name 'hidden-project'
        'show-automation-project',
        'View All',
        'Show Less'
    );

    setupViewAllToggle(
        'view-all-btn-guide-link',
        'hidden-card-cheat', // Pass only the class name 'hidden-project'
        'show-card-cheat',
        'View All',
        'Show Less'
    );

    // --- Scroll to top with progress indicator ---
    const scrollBtn = document.getElementById("scrollUpBtn");
    if (scrollBtn) {
        const circle = scrollBtn.querySelector(".progress-circle .progress");
        // The radius of the circle in the SVG is 15.9155.
        const circumference = 2 * Math.PI * 15.9155;

        if (circle) {
            // Set initial dash array and offset
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        }

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            // Animate progress circle
            if (circle) {
                const offset = circumference * (1 - scrollPercent);
                circle.style.strokeDashoffset = offset;
            }

            // Show/hide button
            scrollBtn.style.display = scrollTop > 100 ? "block" : "none";
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
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


