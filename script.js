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
            const refreshResponse = await fetch("/refresh", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (refreshResponse.ok) {
                const { token: newToken } = await refreshResponse.json();
                localStorage.setItem("token", newToken);
            } else {
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
    window.location.href = "/index.html";
}

function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found in localStorage");
        alert("Session expired. Please log in again.");
        window.location.href = '/';
        return Promise.reject("No token found");
    }

    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;

    return fetch(url, { ...options, headers })
        .then((response) => {
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                window.location.href = '/';
                throw new Error('Unauthorized');
            }
            return response;
        })
        .catch((error) => {
            console.error("Error in fetchWithToken:", error);
            throw error;
        });
}

const exploreButton = document.getElementById("explore-button");
const categoryItems = document.querySelectorAll("#category-page .card");
const backArrow = document.getElementById("back-arrow");
const nextArrow = document.getElementById("next-arrow");
const navigation = document.getElementById("navigation");
const galleryContainer = document.getElementById("gallery");
const contentListContainer = document.getElementById("contentListContainer");
const backgroundVideo = document.getElementById('background-video');

const pages = {
    landing: document.getElementById("landing-page"),
    category: document.getElementById("category-page"),
    // contentList: document.getElementById("content-list-page"),
    contentList: contentListContainer,
    gallery: document.getElementById("gallery-page"),
};

const handleBackgroundVideo = (pageKey) => {
    if (pageKey === 'landing') {
        backgroundVideo?.classList.add('hidden');
    } else {
        backgroundVideo?.classList.remove('hidden');
    }
};

if (exploreButton) {
    exploreButton.addEventListener("click", () => {
        console.log("Explore button clicked");
        showPage("category");
    });
} else {
    console.error("Explore button not found in the DOM.");
}

const galleryTitle = document.createElement("h2");
galleryTitle.className = "gallery-title";
galleryTitle.textContent = "";
galleryContainer.insertAdjacentElement("beforebegin", galleryTitle);

const fetchImagesFromServer = async (category, section) => {
    try {
        console.log(`Fetching images for category: ${category}, section: ${section}`);
        const response = await fetchWithToken(`/api/images?category=${category}&section=${section}`);
        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        // Map the returned array of image paths into objects with a "main" property
        const images = await response.json();
        const formattedImages = images.map((img) => ({
            main: img, // Main image
            subImages: [img], // Placeholder for sub-images, you can replace this later
        }));

        console.log(`Formatted images for ${category} - ${section}:`, formattedImages);
        return formattedImages;
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};


let currentPage = "landing";
let selectedCategory = null;

const contentList = [
    { element: "kitchen", label: "Kitchen", image: "./assets/images/kitchen.jpg" },
    { element: "master-bedroom", label: "Master Bedroom - Wardrobe", image: "./assets/images/master-bedroom.jpg" },
    { element: "kids-bedroom", label: "Kids Bedroom - Wardrobe", image: "./assets/images/kidsbedroom.jpg" },
    { element: "guest-bedroom", label: "Guest Bedroom - Wardrobe", image: "./assets/images/guestbedroom.jpg" },
    { element: "dresser", label: "Dresser", image: "./assets/images/dresser.jpg" },
    { element: "living-tv", label: "Living - TV Wall", image: "./assets/images/livingtv.jpg" },
    { element: "living-feature", label: "Living Feature Wall", image: "./assets/images/livingfeature.jpg" },
    { element: "pooja-room", label: "Pooja Room", image: "./assets/images/poojaroom.jfif" },
    { element: "crockery", label: "Crockery", image: "./assets/images/crockery.jfif" },
    { element: "partition-wall", label: "Partition Wall", image: "./assets/images/partitionwall.jpg" },
    { element: "shoe-rack", label: "Shoe Rack", image: "./assets/images/shoeroom.jfif" },
    { element: "utility", label: "Utility", image: "./assets/images/utility.jfif" },
    { element: "vanity", label: "Vanity", image: "./assets/images/vanity.jfif" },
];

const renderContentList = () => {
    const dreamPackageTitle = document.getElementById("dreamPackageTitle");
    if (dreamPackageTitle) {
        dreamPackageTitle.classList.remove("hidden");
    }
    contentListContainer.innerHTML = contentList
        .map(
            (item) => `
            <figure class="figure" data-element="${item.element}">
                <img src="${item.image}" alt="${item.label}" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Not+Found'">
                <div class="title-overlay">${item.label}</div> <!-- Always visible title -->
            </figure>`
        )
        .join("");

    const contentItems = document.querySelectorAll(".figure");
    contentItems.forEach((item) => {
        item.addEventListener("click", async (e) => {
            const section = e.currentTarget.dataset.element;
            console.log(`Selected section: ${section}`);
            const models = await fetchImagesFromServer(selectedCategory, section);
            if (models.length > 0) {
                renderGalleryImages(models, section);
            } else {
                galleryContainer.innerHTML = "<p>No images available</p>";
            }
            showPage("gallery");
        });
    });
};

const renderGalleryImages = (models, section) => {
    const gallery = document.getElementById("gallery");

    gallery.innerHTML = models
        .map(
            (model, index) => `
            <div class="custom-gallery-item">
                <img src="${model.main}" alt="Model ${index + 1}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                <button class="wishlist-btn" 
                    onclick="toggleWishlist('${model.main}', '${section} - Model ${index + 1}')">
                    ❤️
                </button>
                <div class="content">
                    <h3>${section} - Model ${index + 1}</h3>
                    <button onclick="fetchSubImages('${section}', '${model.main}')">
                        Full Screen
                    </button>
                </div>
            </div>
        `
        )
        .join("");
};


const fetchSubImages = async (section, mainImage) => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token found");

        // Add the Authorization header with the Bearer token
        const response = await fetch(`/api/sub-images?section=${section}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch sub-images");

        const subImages = await response.json(); // Expect an array of image URLs

        // Call the full-screen view with fetched sub-images
        showFullScreen(mainImage, subImages);
    } catch (error) {
        console.error("Error fetching sub-images:", error);
        alert("Failed to load additional images. Please check your session.");
    }
};


window.showFullScreen = (mainImage, subImages) => {
    const fullScreenDiv = document.createElement("div");
    fullScreenDiv.className = "full-screen-container";
    fullScreenDiv.innerHTML = `
        <img src="${mainImage}" id="fullScreenImage" alt="Full Screen">
        <div class="sub-images">
            ${subImages
                .map(
                    (img, index) => `
                <img src="${img}" onclick="switchImage('${img}', this)" class="${index === 0 ? 'active' : ''}">
            `
                )
                .join("")}
        </div>
        <button class="close-fullscreen" onclick="closeFullScreen()">Close</button>
    `;
    document.body.appendChild(fullScreenDiv);
};



window.closeFullScreen = () => {
    const fullScreenDiv = document.querySelector(".full-screen-container");
    if (fullScreenDiv) fullScreenDiv.remove();
};

window.switchImage = (src, element) => {
    document.getElementById("fullScreenImage").src = src;
    document.querySelectorAll(".sub-images img").forEach(img => img.classList.remove("active"));
    element.classList.add("active");
};

window.showFullScreen = showFullScreen;
window.closeFullScreen = closeFullScreen;
window.switchImage = switchImage;


const showPage = (pageKey) => {
    Object.values(pages).forEach((page) => page?.classList.add("hidden"));
    pages[pageKey]?.classList.remove("hidden");


    const dreamPackageTitle = document.getElementById("dreamPackageTitle");
    if (dreamPackageTitle && pageKey !== "contentList") {
        dreamPackageTitle.classList.add("hidden");
    }

    currentPage = pageKey;

    navigation?.classList.toggle("hidden", pageKey === "landing");

    backArrow.disabled = pageKey === "landing";
    nextArrow.disabled = pageKey === "gallery";

    handleBackgroundVideo(pageKey);
   


    if (pageKey === "contentList") {
        renderContentList();
    }
};

exploreButton.addEventListener("click", () => {
    showPage("category");
    window.scrollTo({ top: 0, behavior: "smooth" });
});

categoryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        selectedCategory = ["standard", "premium", "luxury"][index];
        console.log(`Selected category: ${selectedCategory}`);
        showPage("contentList");
    });
});

backArrow.addEventListener("click", () => {
    if (currentPage === "gallery") showPage("contentList");
    else if (currentPage === "contentList") showPage("category");
    else if (currentPage === "category") showPage("landing");
});

nextArrow.addEventListener("click", () => {
    if (currentPage === "category") showPage("contentList");
    else if (currentPage === "contentList") showPage("gallery");
});
