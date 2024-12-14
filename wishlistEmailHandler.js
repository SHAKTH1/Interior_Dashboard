const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shakthi@posspole.com', // Replace with your email
        pass: 'dzro fvkr usix bsjo' // Replace with your email password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendWishlistEmails = async (req, res) => {
    const { userName, userEmail, userPhone, wishlist } = req.body;

    if (!userName || !userEmail || !userPhone || wishlist.length === 0) {
        return res.status(400).send("All fields are required!");
    }

    // Email to the customer
    const customerMailOptions = {
        from: 'shakthi@posspole.com',
        to: userEmail,
        subject: "Thank You for Choosing Your Interior Design Preferences",
        html: `
        <p>Dear ${userName},</p>
        <p>Thank you for reaching out to us and sharing your interior design preferences through our website!</p>
        <p>We have received your wishlist:</p>
        <ul>
            ${wishlist.map(item => `<li>${item.details}</li>`).join("")}
        </ul>
        <p>Our team is reviewing your choices to prepare a personalized quotation. We will get back to you shortly.</p>
        <p>Thank you for trusting us to make your dream interiors a reality!</p>
        <p>Warm regards,</p>
        <p>Meritus</p>
        <p>3504, 80 Feet Rd, Raghuvanahalli,<br> Bangalore City Municipal Corporation Layout,<br> Bengaluru, <br> Karnataka 560062</p>
        `
    };

    // Email to the company
    const companyMailOptions = {
        from: 'shakthi@posspole.com',
        to: 'support@meritus.com', // Replace with company email
        subject: "New Customer Wishlist Details for Quotation",
        html: `
        <p>Dear Team,</p>
        <p>A new customer has finalized their wishlist on the website. Below are the details:</p>
        <p><strong>Customer Details:</strong></p>
        <ul>
            <li>Name: ${userName}</li>
            <li>Email: ${userEmail}</li>
            <li>Phone: ${userPhone}</li>
        </ul>
        <p><strong>Wishlist Details:</strong></p>
        <ul>
            ${wishlist.map(item => `<li>${item.details}</li>`).join("")}
        </ul>
        <p>Please review the wishlist and prepare a detailed quotation for the customer.</p>
        <p>Best regards,</p>
        <p>Your Website</p>
        `
    };

    try {
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(companyMailOptions);
        res.status(200).send("Emails sent successfully!");
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).send("Failed to send emails.");
    }
};

module.exports = { sendWishlistEmails };
