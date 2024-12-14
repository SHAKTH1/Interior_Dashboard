document.addEventListener('DOMContentLoaded', () => {
    const progressSteps = [
        'REGISTERED',
        'EXPLORE',
        'INTERIO',
        'PACKAGE',
        'ADD TO WISHLIST',
        'GET QUOTE',
    ];
    let currentStep = 0;

    const updateProgressBar = (step) => {
        const progressPoint = document.getElementById('progress-point');
        const progressLabels = document.querySelectorAll('.progress-labels span');
        const progressBarActive = document.getElementById('progress-bar-active');
        const totalSteps = progressSteps.length - 1;

        if (step < 0 || step > totalSteps) {
            console.error("Invalid step:", step);
            return;
        }

        currentStep = step;

        // Calculate the left percentage
        const leftPercentage = (step / totalSteps) * 100;

        // Update the active line and progress point
        if (progressBarActive) {
            progressBarActive.style.width = `${leftPercentage}%`;
        }
        if (progressPoint) {
            progressPoint.style.left = `${leftPercentage}%`;
        }

        // Update labels
        progressLabels.forEach((label, index) => {
            label.classList.toggle('active', index <= step);
        });
    };

    // Simulate progress on page load
    setTimeout(() => updateProgressBar(1), 1000); // Start at "Explore"

    // Event listeners for buttons to progress further
    const exploreButton = document.getElementById('explore-button');
    exploreButton?.addEventListener('click', () => updateProgressBar(2)); // To "Interio"

    const categoryItems = document.querySelectorAll('#category-page .card p');
    categoryItems.forEach((item, index) => {
        item.addEventListener('click', () => updateProgressBar(3)); // To "Package"
    });

    const wishlistIcon = document.getElementById('wishlist-icon');
    wishlistIcon?.addEventListener('click', () => {
        updateProgressBar(4); // To "Add to Wishlist"
    });

    const getQuoteButton = document.getElementById('get-quote-btn');
    getQuoteButton?.addEventListener('click', () => updateProgressBar(5)); // To "Get Quote"

    // Function to handle wishlist button clicks
    const toggleWishlist = (modelSrc, modelDetails) => {
        console.log(`Wishlist updated with: ${modelSrc}, ${modelDetails}`);
        updateProgressBar(4); // Automatically progress to "Add to Wishlist"
    };

    // Expose toggleWishlist globally so it can be reused in wishlist.js
    window.toggleWishlist = toggleWishlist;
});
