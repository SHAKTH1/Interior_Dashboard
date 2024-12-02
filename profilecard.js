document.addEventListener("DOMContentLoaded", async () => {
    const profileIcon = document.getElementById("profile-icon");
    const profileCard = document.getElementById("profile-card");
    const profileName = document.getElementById("profile-name");
    const profileEmail = document.getElementById("profile-email");
    const profilePhone = document.getElementById("profile-phone");
    const profileImage = document.getElementById("profile-image");
    const profileIconImg = document.getElementById("profile-icon-img");
    const logoutButton = document.getElementById("logout-button");

    // Fetch profile details from API
    try {
        const response = await fetchWithToken('/api/profile');
        if (!response.ok) throw new Error("Failed to fetch profile data");

        const profile = await response.json();
        profileName.textContent = profile.username || "Name not available";
        profileEmail.textContent = profile.email || "Email not available";
        profilePhone.textContent = profile.phone || "Phone not available";

        // Set profile image for both icon and card
        const profileImageUrl = `https://i.pravatar.cc/150?u=${profile.email}`;
        profileImage.src = profileImageUrl;
        profileIconImg.src = profileImageUrl;
    } catch (error) {
        console.error("Error fetching profile details:", error);
    }

    // Toggle profile card visibility
    profileIcon.addEventListener("click", () => {
        profileCard.classList.toggle("hidden");
        profileCard.classList.toggle("active");
    });

    // Hide profile card when clicking outside
    document.addEventListener("click", (event) => {
        if (!profileCard.contains(event.target) && !profileIcon.contains(event.target)) {
            profileCard.classList.add("hidden");
            profileCard.classList.remove("active");
        }
    });

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to signin page
    });
});


