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
    // Form submission handler
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
});
