document.addEventListener("DOMContentLoaded", () => {
    const protocolCards = document.querySelectorAll(".protocol-card");

    protocolCards.forEach(clickedCard => {
        clickedCard.addEventListener("click", () => {
            // Check if the card that was clicked is already expanded
            const wasAlreadyExpanded = clickedCard.classList.contains("expanded");

            // First, remove the 'expanded' class from all cards
            protocolCards.forEach(card => {
                card.classList.remove("expanded");
            });

            // If the clicked card was not already expanded, add the 'expanded' class to it
            if (!wasAlreadyExpanded) {
                clickedCard.classList.add("expanded");
            }
        });
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
    })
});