document.addEventListener("DOMContentLoaded", () => {
    const pageLoader = document.getElementById("page-loader");

    // Show loader
    const showLoader = () => {
        pageLoader.style.display = "flex";
    };

    // Hide loader
    const hideLoader = () => {
        pageLoader.style.display = "none";
    };

    // Function to check if all images are loaded
    const allImagesLoaded = () => {
        return new Promise((resolve) => {
            const images = document.querySelectorAll("img");
            let loadedCount = 0;

            images.forEach((img) => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.addEventListener("load", () => {
                        loadedCount++;
                        if (loadedCount === images.length) resolve();
                    });
                }
            });

            if (loadedCount === images.length) resolve();
        });
    };

    // Simulate resource and image loading
    const simulateResourceLoading = async () => {
        showLoader(); // Show loader during loading
        await allImagesLoaded();
        setTimeout(hideLoader, 500); // Hide loader after delay
    };

    // Call simulateResourceLoading on page load
    simulateResourceLoading();

    // Global function for handling API loading
    const handleApiRequest = async (apiRequest) => {
        try {
            showLoader();
            const result = await apiRequest();
            return result;
        } catch (error) {
            console.error("Error during API request:", error);
        } finally {
            hideLoader();
        }
    };

    // Attach loader to the "Get Quote" button click
    const getQuoteButton = document.getElementById("get-quote-btn");
    if (getQuoteButton) {
        getQuoteButton.addEventListener("click", async () => {
            await handleApiRequest(async () => {
                const userDetails = await fetchUserDetails();
                const { username: name, email, phone } = userDetails;

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

                if (!response.ok) throw new Error("Failed to send quote request.");
                alert("Quote request sent successfully!");
            });
        });
    }
});
