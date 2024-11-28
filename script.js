console.log("JavaScript Loaded");

// Get buttons and navigation container
const exploreButton = document.getElementById("explore-button");
const categoryItems = document.querySelectorAll(".grid-item");
const backArrow = document.getElementById("back-arrow");
const nextArrow = document.getElementById("next-arrow");
const navigation = document.getElementById("navigation");
const galleryContainer = document.getElementById("gallery");
const contentListContainer = document.querySelector(".content-list");

// Map pages to their DOM elements
const pages = {
    landing: document.getElementById("landing-page"),
    category: document.getElementById("category-page"),
    contentList: document.getElementById("content-list-page"),
    gallery: document.getElementById("gallery-page"),
};


// Gallery title container
const galleryTitle = document.createElement("h2");
galleryTitle.className = "gallery-title";
galleryTitle.textContent = ""; // Title will be updated dynamically
galleryContainer.insertAdjacentElement("beforebegin", galleryTitle);


// Fetch images dynamically from the server
const fetchImagesFromServer = async (category, section) => {
    try {
        console.log(`Fetching images for category: ${category}, section: ${section}`);
        const response = await fetch(`/api/images?category=${category}&section=${section}`);
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
    { element: "living-tv", label: "Living – TV Wall" },
    { element: "living-feature", label: "Living – Feature Wall" },
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
                `<li data-element="${item.element}" class="content-item">${item.label}</li>`
        )
        .join("");

    // Add event listeners to dynamically generated list items
    const contentItems = document.querySelectorAll(".content-item");
    contentItems.forEach((item) => {
        item.addEventListener("click", async (e) => {
            const section = e.target.dataset.element; // Get the section
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


// Function to render the gallery with dynamic styling and labels
const renderGallery = (images, section) => {
    // Update the gallery title
    galleryTitle.textContent = `${section} Models`;

    // Render the images with labels
    galleryContainer.innerHTML = images
        .map(
            (src, index) =>
                `<div class="box" style="background-image: url('${src}');" onclick="openFullScreen('${src}')">
            <div class="overlay-label">Model ${index + 1}</div>
        </div>`
        )
        .join("");

    // Update the CSS variable --childs dynamically
    galleryContainer.style.setProperty("--childs", images.length);
};

// Function to display image in full screen
const openFullScreen = (imageSrc) => {
    // Ensure the image source URL is handled correctly
    const sanitizedSrc = encodeURI(imageSrc);

    // Create a full-screen container
    const fullScreenContainer = document.createElement("div");
    fullScreenContainer.className = "full-screen-container";
    fullScreenContainer.innerHTML = `
        <img src="${sanitizedSrc}" class="full-screen-image" alt="Full Screen Model" />
        <button class="close-button" onclick="closeFullScreen()">Close</button>
    `;

    // Append the container to the body
    document.body.appendChild(fullScreenContainer);
};


// Function to close the full screen view
const closeFullScreen = () => {
    const fullScreenContainer = document.querySelector(".full-screen-container");
    if (fullScreenContainer) {
        fullScreenContainer.remove();
    }
};

// Function to show a specific page
const showPage = (pageKey) => {
    // Hide all pages
    Object.values(pages).forEach((page) => page.classList.add("hidden"));
    // Show the selected page
    pages[pageKey].classList.remove("hidden");
    currentPage = pageKey;

    // Show or hide navigation
    navigation.classList.toggle("hidden", pageKey === "landing");

    // Enable or disable navigation buttons
    backArrow.disabled = pageKey === "landing";
    nextArrow.disabled = pageKey === "gallery";

    // Render content list when navigating to the content list page
    if (pageKey === "contentList") {
        renderContentList();
    }
};

// Show the category page and navigation when "Explore More" is clicked
exploreButton.addEventListener("click", () => {
    showPage("category");
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Add event listeners for category items
categoryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        selectedCategory = e.target.dataset.category; // Set the selected category
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
