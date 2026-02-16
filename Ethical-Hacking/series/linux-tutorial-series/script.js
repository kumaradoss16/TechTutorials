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
});


function downloadAllImages() {
    const link = document.createElement('a');
    link.href = "assets.rar";
    link.download = "assets.rar"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
