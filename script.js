console.log("JavaScript Loaded");

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch("/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
            // Try refreshing the token if expired
            const refreshResponse = await fetch("/refresh", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (refreshResponse.ok) {
                const { token: newToken } = await refreshResponse.json();
                localStorage.setItem("token", newToken); // Update token
            } else {
                // Redirect to login if refresh fails
                redirectToLogin();
            }
        } else if (!response.ok) {
            redirectToLogin();
        }
    } catch (error) {
        console.error("Error during token validation:", error);
        redirectToLogin();
    }
});

function redirectToLogin() {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/signin.html";
}


// Utility function to include token in fetch headers
function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
        console.error("No token found in localStorage");
        alert("Session expired. Please log in again.");
        window.location.href = '/'; // Redirect to login
        return Promise.reject("No token found");
    }

    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;

    // Include headers in the options
    return fetch(url, { ...options, headers })
        .then((response) => {
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                window.location.href = '/'; // Redirect to login
                throw new Error('Unauthorized');
            }
            return response;
        })
        .catch((error) => {
            console.error("Error in fetchWithToken:", error);
            throw error;
        });
        
}


// Get buttons and navigation container
const exploreButton = document.getElementById("explore-button");
const categoryItems = document.querySelectorAll("#category-page .card p");
const backArrow = document.getElementById("back-arrow");
const nextArrow = document.getElementById("next-arrow");
const navigation = document.getElementById("navigation");
const galleryContainer = document.getElementById("gallery");
const contentListContainer = document.querySelector(".content-list");
const backgroundVideo = document.getElementById('background-video');

// Map pages to their DOM elements
const pages = {
    landing: document.getElementById("landing-page"),
    category: document.getElementById("category-page"),
    contentList: document.getElementById("content-list-page"),
    gallery: document.getElementById("gallery-page"),
};

// Function to show or hide the background video
const handleBackgroundVideo = (pageKey) => {
    if (pageKey === 'gallery') {
        backgroundVideo.classList.add('hidden'); // Hide the video when viewing models
    } else {
        backgroundVideo.classList.remove('hidden'); // Show the video on other pages
    }
};

if (exploreButton) {
    // Add click event to the Explore button
    exploreButton.addEventListener("click", () => {
        console.log("Explore button clicked");
        showPage("category");
    });
} else {
    console.error("Explore button not found in the DOM.");
}

// Gallery title container
const galleryTitle = document.createElement("h2");
galleryTitle.className = "gallery-title";
galleryTitle.textContent = ""; // Title will be updated dynamically
galleryContainer.insertAdjacentElement("beforebegin", galleryTitle);



// Fetch images dynamically from the server
const fetchImagesFromServer = async (category, section) => {
    try {
        console.log(`Fetching images for category: ${category}, section: ${section}`);
        const response = await fetchWithToken(`/api/images?category=${category}&section=${section}`);
        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }
        const images = await response.json();
        console.log(`Fetched images for ${category} - ${section}:`, images);
        return images;
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};


// Track the current page and selected category
let currentPage = "landing";
let selectedCategory = null;

// Content list for dynamic rendering
const contentList = [
    { element: "kitchen", label: "Kitchen" },
    { element: "master-bedroom", label: "Master Bedroom - Wardrobe" },
    { element: "kids-bedroom", label: "Kids Bedroom - Wardrobe" },
    { element: "guest-bedroom", label: "Guest Bedroom - Wardrobe" },
    { element: "dresser", label: "Dresser" },
    { element: "living-tv", label: "Living - TV Wall" },
    { element: "living-feature", label: "Living  Feature Wall" },
    { element: "pooja-room", label: "Pooja Room" },
    { element: "crockery", label: "Crockery" },
    { element: "partition-wall", label: "Partition Wall" },
    { element: "shoe-rack", label: "Shoe Rack" },
    { element: "utility", label: "Utility" },
    { element: "vanity", label: "Vanity" },
];

// Function to render the content list dynamically
const renderContentList = () => {
    contentListContainer.innerHTML = contentList
        .map(
            (item) =>
               `<li data-element="${item.element}" class="fancy-list-item">
                    <span>${item.label}</span>
                 </li>`
        )
        .join("");

    // Add event listeners to dynamically generated list items
    const contentItems = document.querySelectorAll(".fancy-list-item");
    contentItems.forEach((item) => {
        item.addEventListener("click", async (e) => {
            const section = e.currentTarget.
            dataset.element; // Get the section
            console.log(`Selected section: ${section}`);

            // Fetch images dynamically
            const models = await fetchImagesFromServer(selectedCategory, section);

            if (models.length > 0) {
                renderGallery(models, section); // Render gallery with fetched images
            } else {
                galleryContainer.innerHTML = "<p>No images available</p>";
            }

            // Navigate to gallery page
            showPage("gallery");
        });
    });
};

// Function to render the gallery and attach click events for full-screen
const renderGalleryImages = (images, section) => {
    const galleryElement = document.getElementById("gallery");

    galleryElement.innerHTML = images
        .map(
            (src, index) => `
            <div class="image-box">
                <img 
                    src="${src}" 
                    class="gallery-thumbnail" 
                    alt="${section} - Model ${index + 1}" 
                />
                <div class="image-overlay-label">Model ${index + 1}</div>
                <button 
                    class="full-screen-button" 
                    data-src="${src}" 
                    aria-label="View Full Screen">
                    Full Screen
                </button>
            </div>`
        )
        .join("");

    // Attach event listener to "Full Screen" buttons
    const fullScreenButtons = galleryElement.querySelectorAll(".full-screen-button");
    fullScreenButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const imageSrc = e.currentTarget.dataset.src;
            console.log(`Full Screen button clicked for image: ${imageSrc}`);
            showFullScreenImage(imageSrc); // Open image in full-screen mode
        });
    });
};
const showFullScreenImage = (imageSrc) => {
    // Ensure the image source URL is valid and properly encoded
    const safeSrc = encodeURI(imageSrc);

    // Create a full-screen container
    const fullScreenDiv = document.createElement("div");
    fullScreenDiv.className = "image-full-screen-container";
    fullScreenDiv.innerHTML = `
        <div class="full-screen-overlay">
            <img src="${safeSrc}" class="image-full-screen" alt="Full Screen Model" />
            <button class="image-close-button" id="closeFullScreen">Close</button>
        </div>
    `;

    // Append the container to the body
    document.body.appendChild(fullScreenDiv);

    // Add event listener to the close button
    document
        .getElementById("closeFullScreen")
        .addEventListener("click", closeFullScreenImage);
};


const closeFullScreenImage = () => {
    const fullScreenDiv = document.querySelector(".image-full-screen-container");
    if (fullScreenDiv) {
        fullScreenDiv.remove(); // Remove the full-screen container from the DOM
    }
};


// Modified showPage function
const showPage = (pageKey) => {
    // Hide all pages
    Object.values(pages).forEach((page) => page.classList.add('hidden'));
    // Show the selected page
    pages[pageKey].classList.remove('hidden');
    currentPage = pageKey;

    // Show or hide navigation
    navigation.classList.toggle('hidden', pageKey === 'landing');

    // Enable or disable navigation buttons
    backArrow.disabled = pageKey === 'landing';
    nextArrow.disabled = pageKey === 'gallery';

    // Handle background video visibility
    handleBackgroundVideo(pageKey);

    // Render content list when navigating to the content list page
    if (pageKey === 'contentList') {
        renderContentList();
    }
};


// Show the category page and navigation when "Explore More" is clicked
exploreButton.addEventListener("click", () => {
    showPage("category");
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Add event listeners for category items
categoryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        selectedCategory = ["standard", "premium", "luxury"][index]; // Map the index to category
        console.log(`Selected category: ${selectedCategory}`);
        showPage("contentList");
    });
});

// Handle back arrow navigation
backArrow.addEventListener("click", () => {
    if (currentPage === "gallery") showPage("contentList");
    else if (currentPage === "contentList") showPage("category");
    else if (currentPage === "category") showPage("landing");
});

// Handle next arrow navigation
nextArrow.addEventListener("click", () => {
    if (currentPage === "category") showPage("contentList");
    else if (currentPage === "contentList") showPage("gallery");
});



// // Function to display image in full screen
// const openFullScreen = (imageSrc) => {
//     // Ensure the image source URL is handled correctly
//     const sanitizedSrc = encodeURI(imageSrc);

//     // Create a full-screen container
//     const fullScreenContainer = document.createElement("div");
//     fullScreenContainer.className = "full-screen-container";
//     fullScreenContainer.innerHTML = `
//         <img src="${sanitizedSrc}" class="full-screen-image" alt="Full Screen Model" />
//         <button class="close-button" onclick="closeFullScreen()">Close</button>
//     `;

//     // Append the container to the body
//     document.body.appendChild(fullScreenContainer);
// };


// // Function to close the full screen view
// const closeFullScreen = () => {
//     const fullScreenContainer = document.querySelector(".full-screen-container");
//     if (fullScreenContainer) {
//         fullScreenContainer.remove();
//     }
// };

// document.addEventListener("DOMContentLoaded", async () => {
//     const profileIcon = document.getElementById("profile-icon");
//     const profileCard = document.getElementById("profile-card");
//     const profileName = document.getElementById("profile-name");
//     const profileEmail = document.getElementById("profile-email");
//     const profilePhone = document.getElementById("profile-phone");
//     const profileImage = document.getElementById("profile-image");
//     const profileIconImage = document.getElementById("profile-icon-img");
//     const logoutButton = document.getElementById("logout-button");

//     // Fetch profile details from API
//     try {
//         const response = await fetchWithToken('/api/profile');
//         if (!response.ok) throw new Error("Failed to fetch profile data");

//         const profile = await response.json();
//         profileName.textContent = profile.username || "Name not available";
//         profileEmail.textContent = profile.email || "Email not available";
//         profilePhone.textContent = profile.phone || "Phone not available";

//         // Set a random profile picture for both the icon and the profile card
//         const profileImageUrl = `https://i.pravatar.cc/150?u=${profile.email}`;
//         profileImage.src = profileImageUrl;
//         profileIconImage.src = profileImageUrl;
//     } catch (error) {
//         console.error("Error fetching profile details:", error);
//     }

//     // Toggle visibility of profile card when clicking on the profile icon
//     profileIcon.addEventListener("click", () => {
//         profileCard.classList.toggle("active");
//     });

//     // Logout functionality
//     logoutButton.addEventListener("click", () => {
//         localStorage.removeItem('token'); // Remove token from localStorage
//         alert("Logged out successfully!");
//         window.location.href = '/'; // Redirect to login page
//     });
//     // Close the profile card when clicking outside
//     document.addEventListener("click", (event) => {
//         if (!profileCard.contains(event.target) && !profileIcon.contains(event.target)) {
//             profileCard.classList.remove("active");
//         }
//     });
// });



// const renderGallery = (images, section) => {
  
//     galleryTitle.textContent = `${section} Models`;

//     galleryContainer.innerHTML = images
//         .map(
//             (src, index) =>
//                 `<div class="box" style="background-image: url('${src}');">
//                     <div class="overlay-label">Model ${index + 1}</div>
//                     <button class="wishlist-btn" onclick="toggleWishlist('${src}')">❤️</button>
//                 </div>`
//         )
//         .join("");

 
//     galleryContainer.style.setProperty("--childs", images.length);
// };