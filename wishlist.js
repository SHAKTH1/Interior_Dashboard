document.addEventListener("DOMContentLoaded", () => {
    const pageLoader = document.getElementById("page-loader");

    // Global functions for showing and hiding loader
    const showLoader = () => {
        pageLoader.style.display = "flex";
    };

    const hideLoader = () => {
        pageLoader.style.display = "none";
    };

    // Function to ensure all images on the page are loaded
    const allImagesLoaded = (selector = "img") => {
        return new Promise((resolve) => {
            const images = document.querySelectorAll(selector);
            let loadedCount = 0;

            if (images.length === 0) return resolve();

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

    // Universal function to wrap API requests with loader
    const withLoader = async (task) => {
        try {
            showLoader();
            await task();
        } catch (error) {
            console.error("Error during operation:", error);
        } finally {
            hideLoader();
        }
    };

    // Simulate resource and image loading for the page
    const simulateResourceLoading = async () => {
        showLoader();
        await allImagesLoaded(); // Wait for images to load
        setTimeout(hideLoader, 500); // Smooth transition
    };

    // Trigger page loader on navigation
    const setupPageLoader = () => {
        document.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON" || e.target.classList.contains("navigation")) {
                simulateResourceLoading();
            }
        });
    };

    // API Handler for Get Quote Button
    const setupGetQuoteButton = () => {
        document.addEventListener("click", async (e) => {
            if (e.target && e.target.id === "get-quote-btn") {
                await withLoader(async () => {
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
            }
        });
    };

    // Call on page load
    simulateResourceLoading(); // Initial page load
    setupPageLoader(); // Attach loader for page navigation
    setupGetQuoteButton(); // Attach loader for "Get Quote"
});
