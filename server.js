require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");
const path = require("path");
const jwt = require('jsonwebtoken');
const fs = require("fs"); 
const authenticateToken = require('./authenticateToken');

const app = express();
const PORT = 3005;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  


app.post('/signup', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newUser = new User({ username, email, phone, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

app.post('/signin',  async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username }, // Payload
            process.env.JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Token expiration time
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        // Fetch user details based on the user ID from the token
        const user = await User.findById(req.user.id, 'username email phone');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user details
        res.json({
            username: user.username,
            email: user.email,
            phone: user.phone,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Section-to-folder mapping
const sectionMapping = {
    kitchen: "KITCHEN",
    "master-bedroom": "MBR",
    "kids-bedroom": "KBR",
    dining: "DINING",
    living: "LIVING",
    dresser: "DRESSER",
    "living-tv": "LIVING_TV",
    "living-feature": "LIVING_FEATURE",
    "pooja-room": "POOJA",
    crockery: "CROCKERY",
    "partition-wall": "PARTITION",
    "shoe-rack": "SHOE",
    utility: "UTILITY",
    vanity: "VANITY",
};

// Protect the /api/images route
app.get("/api/images", authenticateToken, (req, res) => {
    const { category, section } = req.query; // e.g., "standard", "kitchen"

    const folderName = sectionMapping[section];
    if (!folderName) {
        console.error(`No folder mapping found for section: ${section}`);
        return res.status(400).json({ error: "Invalid section" });
    }

    const directoryPath = path.join(__dirname, "assets/images", category, folderName);

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: "Unable to fetch images" });
        }

        const imageFiles = files.filter(
            (file) => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png")
        );

        const imagePaths = imageFiles.map(
            (file) => `/assets/images/${category}/${folderName}/${file}`
        );
        res.json(imagePaths);
    });
});


// Middleware for token injection
app.use((req, res, next) => {
    const token = req.query.token || req.headers['authorization'];
    if (token) {
        req.headers['authorization'] = `Bearer ${token}`;
    }
    next();
});

// Dashboard Route with JWT Authentication
app.get('/dashboard', authenticateToken, (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the signin.html file for the root path
app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "signin.html"));
});





// Serve static files from the "assets" directory
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve static files from the root directory
app.use(express.static(__dirname));


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

