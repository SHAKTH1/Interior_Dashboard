const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3005;


// Section-to-folder mapping
const sectionMapping = {
    kitchen: "KITCHEN",
    "master-bedroom": "MBR",
    "kids-bedroom": "KBR",
    dining: "DINING",
    living: "LIVING",
    // Add other mappings as needed
};

// API to fetch image file names dynamically
app.get("/api/images", (req, res) => {
    const category = req.query.category; // e.g., "standard"
    const section = req.query.section; // e.g., "master-bedroom"

    // Map the section to the actual folder name
    const folderName = sectionMapping[section];
    if (!folderName) {
        console.error(`No folder mapping found for section: ${section}`);
        return res.status(400).send("Invalid section");
    }

    const directoryPath = path.join(__dirname, "assets/images", category, folderName);

    console.log("Fetching images from:", directoryPath); // Debugging log

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Unable to fetch images");
        }

        // Filter image files
        const imageFiles = files.filter((file) =>
            file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png")
        );

        console.log("Files found:", imageFiles); // Debugging log

        // Return image URLs
        const imagePaths = imageFiles.map(
            (file) => `/assets/images/${category}/${folderName}/${file}`
        );
        res.json(imagePaths);
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
// Serve static files from the "assets" directory
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve static files from the root directory (for styles.css, script.js, etc.)
app.use(express.static(__dirname));

// Serve the index.html file for the root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
