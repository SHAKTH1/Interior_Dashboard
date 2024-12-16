document.addEventListener("DOMContentLoaded", () => {
    // Initialize wishlist array
    if (!window.wishlist) window.wishlist = [];

        // Function to fetch user details
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token from localStorage
                    }
                });
    
                if (!response.ok) throw new Error('Failed to fetch user details');
    
                const userDetails = await response.json();
                console.log("User Details:", userDetails);
                return userDetails;
            } catch (error) {
                console.error("Error fetching user details:", error);
                alert("Failed to fetch user details.");
                throw error;
            }
        };
    // Function to toggle wishlist items
    window.toggleWishlist = (modelSrc, modelDetails) => {
        const itemIndex = window.wishlist.findIndex((item) => item.src === modelSrc);

        if (itemIndex !== -1) {
            // Remove item if it already exists
            window.wishlist.splice(itemIndex, 1);
            alert("Removed from wishlist!");
        } else {
            // Add item to wishlist
            window.wishlist.push({ src: modelSrc, details: modelDetails });
            alert("Successfully added to wishlist!");
        }

        console.log("Updated Wishlist:", window.wishlist);
        renderWishlistModal();
    };

    // Render wishlist modal
    const renderWishlistModal = () => {
        const wishlistContainer = document.getElementById("wishlist-container");

        if (!wishlistContainer) {
            console.error("Wishlist container not found.");
            return;
        }

        wishlistContainer.innerHTML = ""; // Clear existing content

        if (window.wishlist.length > 0) {
            wishlistContainer.innerHTML = window.wishlist
                .map(
                    (item, index) => `
                    <div class="wishlist-item">
                        <img src="${item.src}" alt="Wishlist Item ${index + 1}" />
                        <div class="wishlist-details">
                            <p>${item.details}</p>
                            <button class="remove-btn" onclick="toggleWishlist('${item.src}', '${item.details}')">
                                Remove
                            </button>
                        </div>
                    </div>`
                )
                .join("");

            // Add the Get Quote button
            wishlistContainer.insertAdjacentHTML(
                "beforeend",
                `<button id="get-quote-btn" class="get-quote-btn" style="margin-top: 20px; padding: 10px; background: #edaa02; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                    Get Quote
                </button>`
            );

            // Attach event listener to Get Quote button
            document.getElementById("get-quote-btn").addEventListener("click", async () => {
                try {
                    if (!window.wishlist || window.wishlist.length === 0) {
                        alert("Your wishlist is empty!");
                        return;
                    }
            
                    const userDetails = await fetchUserDetails();
                    console.log("Fetched User Details:", userDetails);
            
                    const { username: name, email, phone } = userDetails;
            
                    console.log("Sending Wishlist:", {
                        userName: name,
                        userEmail: email,
                        userPhone: phone,
                        wishlist: window.wishlist,
                    });
            
                    const response = await fetch("/api/send-wishlist", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            userName: name,
                            userEmail: email,
                            userPhone: phone,
                            wishlist: window.wishlist,
                        }),
                    });
            
                    if (response.ok) {
                        alert("Quote request sent successfully!");
                    } else {
                        console.error("Server Response:", await response.text());
                        alert("Failed to send quote request.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while sending your request.");
                }
            });
        } else {
            wishlistContainer.innerHTML = "<p>Your wishlist is empty!</p>";
        }
    };
            
    // Show wishlist modal
    window.showWishlist = () => {
        renderWishlistModal();
        document.getElementById("wishlist-modal").classList.remove("hidden");
    };

    // Close wishlist modal
    window.closeWishlist = () => {
        document.getElementById("wishlist-modal").classList.add("hidden");
    };

    // Expose functions globally
    window.toggleWishlist = toggleWishlist;
    window.showWishlist = showWishlist;
    window.closeWishlist = closeWishlist;
});
