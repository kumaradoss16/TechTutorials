document.addEventListener("DOMContentLoaded", () => {

    // --- Typing Animation for Brand ---
    (function () {
        const el = document.getElementById("brand");
        if (!el) return;
        
        const text = el.dataset.text || "TechTutorials";
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

    // --- Scroll to Top with Progress Indicator ---
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

    // --- Contact Form Validation ---
    const form = document.getElementById("contact-form");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    if (form && emailInput) {
        // Email validation function
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email); // Fixed: was .text(), should be .test()
        }

        // Real-time email validation
        emailInput.addEventListener("blur", function() {
            if (this.value && !isValidEmail(this.value)) {
                emailError.textContent = "Please enter a valid email address.";
                emailError.classList.remove("hidden");
                emailInput.classList.add("border-red-500");
            } else {
                emailError.classList.add("hidden");
                emailInput.classList.remove("border-red-500");
            }
        });

        // Form submission handler
        form.addEventListener("submit", function (event) {
            const emailIsValid = isValidEmail(emailInput.value);

            if (!emailIsValid) {
                event.preventDefault();
                emailError.textContent = "Please enter a valid email address.";
                emailError.classList.remove("hidden");
                emailInput.classList.add("border-red-500");
                emailInput.focus();
            } else {
                emailError.classList.add("hidden");
                emailInput.classList.remove("border-red-500");
                
                // Show loading state
                const submitBtn = form.querySelector('.submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const originalText = btnText.textContent;
                
                btnText.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Note: FormSubmit will handle the actual submission
                // The form will redirect after submission completes
            }
        });
    }
});
