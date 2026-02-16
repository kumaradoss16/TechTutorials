document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // Typewriter Effect
    // ========================================
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

    // ========================================
    // Scroll to Top Button with Progress Indicator
    // ========================================
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
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ========================================
    // Dynamic Wallpaper Generation with Progressive Loading
    // ========================================
    const wallpaperContainer = document.querySelector('.wallpaper-grid');
    const viewAllBtn = document.getElementById('view-all-btn-wallpaper');
    
    // Configuration
    const totalWallpapers = 467;
    const initialLoad = 467;      // Load first 20 wallpapers on page load
    const loadMoreCount = 15;    // Load 15 more wallpapers per button click

    if (!wallpaperContainer) return;

    let loadedCount = 0;

    // Create wallpaper card element
    function createWallpaperCard(index) {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';
        card.innerHTML = `
            <div class="image-wrapper">
                <img 
                    data-src="images_upscale/wallpaper (${index}).png" 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23212536' width='800' height='600'/%3E%3C/svg%3E"
                    alt="Wallpaper ${index}" 
                    loading="lazy"
                    class="lazy-image">
                <button class="download-btn-overlay" title="Download Wallpaper" onclick="downloadWallpaper(${index})">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        return card;
    }

    // Intersection Observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    // Load the actual image
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy-image');
                }
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px',  // Start loading 100px before entering viewport
        threshold: 0.01
    });

    // Load wallpapers in batches
    function loadWallpaperBatch(start, end) {
        const fragment = document.createDocumentFragment();
        
        for (let i = start; i < end && i <= totalWallpapers; i++) {
            const card = createWallpaperCard(i);
            fragment.appendChild(card);
            
            // Observe the image for lazy loading
            const img = card.querySelector('.lazy-image');
            if (img) imageObserver.observe(img);
        }
        
        wallpaperContainer.appendChild(fragment);
        loadedCount = end > totalWallpapers ? totalWallpapers : end;
        
        // Update button state
        updateViewAllButton();
    }

    // Update "View More" button text and visibility
    function updateViewAllButton() {
        if (!viewAllBtn) return;

        if (loadedCount >= totalWallpapers) {
            // All wallpapers loaded - hide button
            viewAllBtn.style.display = 'none';
        } else {
            // Show remaining count
            const remaining = totalWallpapers - loadedCount;
            viewAllBtn.textContent = `Load More (${remaining} remaining)`;
            viewAllBtn.style.display = 'block';
        }
    }

    // Initial load - Show first 20 wallpapers
    loadWallpaperBatch(1, initialLoad);

    // "View More" button click handler - Load 15 more each click
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            if (loadedCount < totalWallpapers) {
                // Add loading state
                viewAllBtn.classList.add('loading');
                viewAllBtn.disabled = true;
                
                // Load next batch after small delay
                setTimeout(() => {
                    const nextBatch = Math.min(loadedCount + loadMoreCount, totalWallpapers);
                    loadWallpaperBatch(loadedCount + 1, nextBatch);
                    
                    // Remove loading state
                    viewAllBtn.classList.remove('loading');
                    viewAllBtn.disabled = false;
                    
                    // Smooth scroll to newly loaded content
                    setTimeout(() => {
                        const allCards = wallpaperContainer.querySelectorAll('.wallpaper-card');
                        const targetIndex = loadedCount - loadMoreCount;
                        const targetCard = allCards[targetIndex];
                        
                        if (targetCard) {
                            targetCard.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }
                    }, 150);
                }, 400);
            }
        });
    }
});

// ========================================
// Download Wallpaper Function
// ========================================
function downloadWallpaper(num) {
    try {
        const link = document.createElement('a');
        link.href = `images_upscale/wallpaper (${num}).png`;
        link.download = `wallpaper_${num}.png`;
        
        // Fallback for browsers that don't support download attribute
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open in new tab
        window.open(`images_upscale/wallpaper (${num}).png`, '_blank');
    }
}