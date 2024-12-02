document.addEventListener("DOMContentLoaded", () => {
    // Wishlist array (stores objects with image source and details)
    let wishlist = [];

    // Function to toggle wishlist
    const toggleWishlist = (modelSrc, modelDetails) => {
        const itemIndex = wishlist.findIndex((item) => item.src === modelSrc);
        if (itemIndex !== -1) {
            wishlist.splice(itemIndex, 1); // Remove the item from wishlist
            alert("Removed from wishlist!");
        } else {
            wishlist.push({ src: modelSrc, details: modelDetails });
            alert("Added to wishlist!");
        }
        console.log("Wishlist:", wishlist);

        // Update the wishlist modal if open
        const wishlistModal = document.getElementById("wishlist-modal");
        if (wishlistModal && !wishlistModal.classList.contains("hidden")) {
            showWishlist();
        }
    };

    // Render the gallery with wishlist icons
    const renderGallery = (images, section) => {
        const galleryTitle = document.querySelector(".gallery-title");
        const galleryContainer = document.getElementById("gallery");
        galleryTitle.textContent = `${section} Models`;
    
        galleryContainer.innerHTML = images
        .map(
            (src, index) => `
            <div class="box" style="background-image: url('${src}');">
                <button 
                    class="wishlist-btn" 
                    data-src="${src}" 
                    data-details="${section} - Model ${index + 1}">
                    ❤️
                </button>
                <div class="overlay-label">Model ${index + 1}</div>
            </div>`
        )
        .join("");
    
        // Remove any previously attached event listeners by replacing the container
        const newGalleryContainer = galleryContainer.cloneNode(true);
        galleryContainer.parentNode.replaceChild(newGalleryContainer, galleryContainer);
    
          // Reattach event listener to wishlist buttons
          const wishlistButtons = document.querySelectorAll(".wishlist-btn");
          wishlistButtons.forEach((button) => {
              button.addEventListener("click", (event) => {
                  event.stopPropagation(); // Prevent parent click events
                  const modelSrc = button.getAttribute("data-src");
                  const modelDetails = button.getAttribute("data-details");
                  toggleWishlist(modelSrc, modelDetails);
              });
          });
    };
    
   // Show the wishlist modal
   const showWishlist = () => {
    const wishlistModal = document.getElementById("wishlist-modal");
    const wishlistContainer = document.getElementById("wishlist-container");

    if (wishlist.length > 0) {
        // Render wishlist items with details
        wishlistContainer.innerHTML = wishlist
            .map(
                (item, index) => `
            <div class="wishlist-item">
                <img src="${item.src}" alt="Wishlist Model ${index + 1}" />
                <div class="wishlist-details">
                    <p>${item.details}</p>
                    <button 
                        class="remove-btn" 
                        data-src="${item.src}" 
                        data-details="${item.details}">
                        Remove
                    </button>
                </div>
            </div>`
            )
            .join("");

        // Attach event listeners to "Remove" buttons
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent parent click events
                const modelSrc = button.getAttribute("data-src");
                const modelDetails = button.getAttribute("data-details");
                toggleWishlist(modelSrc, modelDetails);
            });
        });
    } else {
        // Show a message when wishlist is empty
        wishlistContainer.innerHTML = "<p>Your wishlist is empty!</p>";
    }

    // Show the modal
    wishlistModal.classList.remove("hidden");
};

    // Close the wishlist modal
    const closeWishlist = () => {
        const wishlistModal = document.getElementById("wishlist-modal");
        wishlistModal.classList.add("hidden");
    };

    // Expose functions globally
    window.renderGallery = renderGallery;
    window.showWishlist = showWishlist;
    window.closeWishlist = closeWishlist;
    window.toggleWishlist = toggleWishlist;
});
