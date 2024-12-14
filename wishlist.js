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
            // Event listener for wishlist cart icon
    const wishlistCartIcon = document.getElementById("wishlist-icon");
    wishlistCartIcon?.addEventListener("click", () => {
        updateProgressBar(5); // Move to "Get Quote"
    });
       
    };

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token from localStorage
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const userDetails = await response.json();
            console.log("User Details:", userDetails);
            return userDetails;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const showWishlist = () => {
        const wishlistModal = document.getElementById("wishlist-modal");
        const wishlistContainer = document.getElementById("wishlist-container");

        if (wishlist.length > 0) {
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

            // Add Get Quote button
            wishlistContainer.insertAdjacentHTML(
                "beforeend",
                `<button id="get-quote-btn" class="get-quote-btn">Get Quote</button>`
            );

            // Attach event listener to Get Quote button
            document.getElementById("get-quote-btn").addEventListener("click", async () => {
                try {
                    const userDetails = await fetchUserDetails();
                    const { username, email, phone } = userDetails;

                    // Send the wishlist and user details to the server
                    const response = await fetch("/api/send-wishlist", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userName: username,
                            userEmail: email,
                            userPhone: phone,
                            wishlist,
                        }),
                    });

                    if (response.ok) {
                        alert("Quote request sent successfully!");
                    } else {
                        alert("Failed to send quote request.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while sending your request.");
                }
            });

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
