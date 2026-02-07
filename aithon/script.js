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

    const form = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
        
            // Disable submit button to prevent double submission
            const submitButton = form.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        
            // Clear previous messages
            formResponse.textContent = '';
            formResponse.classList.remove('hidden', 'success-message', 'error-message');
        
            try {
                const formData = new FormData(form);
            
                // Send the form data
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
            
                const data = await response.json();
            
                if (data.success) {
                    // Success message
                    formResponse.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
                    formResponse.classList.add('success-message');
                    formResponse.classList.remove('hidden');
                
                    // Reset form
                    form.reset();
                
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formResponse.classList.add('hidden');
                    }, 5000);
                } else {
                    // Error message
                    formResponse.textContent = '✗ Failed to send message. Please try again or email us directly.';
                    formResponse.classList.add('error-message');
                    formResponse.classList.remove('hidden');
                }
            } catch (error) {
                // Network error
                formResponse.textContent = '✗ Network error. Please check your connection and try again.';
                formResponse.classList.add('error-message');
                formResponse.classList.remove('hidden');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
            if (emailInput.value && !emailPattern.test(emailInput.value)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.classList.remove('hidden');
                emailInput.classList.add('invalid');
            } else {
                emailError.textContent = '';
                emailError.classList.add('hidden');
                emailInput.classList.remove('invalid');
            }
        });
    }

    // Add CSS for success message
    const style = document.createElement('style');
    style.textContent = `
    .success-message {
        color: #10b981;
        display: block;
        margin-top: 10px;
        font-weight: 500;
    }
    
    .error-message {
        color: #ef4444;
        display: block;
        margin-top: 10px;
        font-weight: 500;
    }
    
    .error-message.hidden,
    .success-message.hidden {
        display: none;
    }
    
    .form-input.invalid {
        border-color: #ef4444;
    }
    
    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
    document.head.appendChild(style);

    const mainButton = document.querySelector('.main-button');
    const buttonContainer = document.querySelector('.button-container');
    
    mainButton.addEventListener('click', function(e) {
        e.preventDefault();
        buttonContainer.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!buttonContainer.contains(e.target)) {
            buttonContainer.classList.remove('active');
        }
    });
});
