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
        const totalSteps = progressSteps.length - 1;

        if (step < 0 || step > totalSteps) return;

        currentStep = step;
        const leftPercentage = (step / totalSteps) * 100;

        if (progressPoint) {
            progressPoint.style.left = `${leftPercentage}%`;
        }

        progressLabels.forEach((label, index) => {
            label.classList.toggle('active', index <= step);
        });
    };

    setTimeout(() => updateProgressBar(1), 1000); // Start at "Explore"

    document.getElementById('explore-button')?.addEventListener('click', () => updateProgressBar(2));

    document.querySelectorAll('#category-page .card').forEach((item, index) => {
        item.addEventListener('click', () => updateProgressBar(3));
    });

    document.getElementById('wishlist-icon')?.addEventListener('click', () => {
        updateProgressBar(4);
    });

    // Hook into the existing wishlist function without overwriting it
    const originalToggleWishlist = window.toggleWishlist;
    window.toggleWishlist = (modelSrc, modelDetails) => {
        if (originalToggleWishlist) originalToggleWishlist(modelSrc, modelDetails);
        updateProgressBar(4); // Progress bar update for "Add to Wishlist"
    };
});
