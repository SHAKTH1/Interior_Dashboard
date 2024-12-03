// Define the progress steps
const progressSteps = [
    'Registered',
    'Explore',
    'Interio',
    'Package',
    'Add to Wishlist',
    'Get Quote',
];
let currentStep = 0;

// Function to update the progress bar
const updateProgressBar = (step) => {
    const progressPoint = document.getElementById('progress-point');
    const labels = document.querySelectorAll('.progress-labels span');
    const progressLine = document.querySelector('.progress-line');
    const totalSteps = progressSteps.length - 1;

    // Ensure the step is within bounds
    if (step < 0 || step > totalSteps) {
        console.error("Invalid step provided:", step);
        return;
    }

    currentStep = step;

    // Calculate the left percentage for the progress point
    const leftPercentage = (step / totalSteps) * 100;

    // Update the position of the progress point
    if (progressPoint) {
        progressPoint.style.left = `${leftPercentage}%`;
    }

    // Update the width of the active portion of the line using CSS variables
    if (progressLine) {
        progressLine.style.setProperty('--progress-width', `${leftPercentage}%`);
    }

    // Update active label colors
    if (labels) {
        labels.forEach((label, index) => {
            label.classList.toggle('active', index <= step);
        });
    }
};

// Event listener for progress update
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar(1); // Initial progress to "Explore"

    // Attach event listeners only if not already added
    if (!window.__progressbarListenersAdded) {
        window.__progressbarListenersAdded = true;

        const exploreButton = document.getElementById('explore-button');
        if (exploreButton) {
            exploreButton.addEventListener('click', () => {
                updateProgressBar(2); // Progress to "Interio"
            });
        }

        const categoryItems = document.querySelectorAll('#category-page .card p');
        if (categoryItems.length > 0) {
            categoryItems.forEach((item) => {
                item.addEventListener('click', () => {
                    updateProgressBar(3); // Progress to "Package"
                });
            });
        }

        const contentListContainer = document.querySelector('.content-list');
        if (contentListContainer) {
            contentListContainer.addEventListener('click', (event) => {
                if (event.target.tagName === 'LI') {
                    updateProgressBar(4); // Progress to "Add to Wishlist"
                }
            });
        }

        const wishlistIcon = document.getElementById('wishlist-icon');
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', () => {
                updateProgressBar(5); // Progress to "Get Quote"
            });
        }
    }
});
