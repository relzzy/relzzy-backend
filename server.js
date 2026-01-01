// 1. Import Express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Import Firebase Admin SDK
const admin = require('firebase-admin');

// 3. Import your service account key file
const serviceAccount = require('./serviceAccountKey.json');

// 4. Initialize the Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 5. Get a reference to the Firestore database
const db = admin.firestore();

// 6. Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 7. Homepage Route
app.get('/', (req, res) => {
  res.send('Relzzy\'s Portfolio Backend is live! 🚀');
});

/**
 * 8. Updated "Contact" Route
 * Changed from '/submit-scam-form' to '/contact'
 */
app.post('/contact', async (req, res) => {
    
    // Extracting the new professional fields from the request body
    const { name, email, subject, message } = req.body;
    
    // Create a clean object to save, adding a timestamp for organization
    const contactData = {
        name,
        email,
        subject,
        message,
        receivedAt: admin.firestore.FieldValue.serverTimestamp() // Good practice for sorting
    };
    
    try {
        // 9. SAVE the data to a new collection named "contacts"
        const docRef = await db.collection('contacts').add(contactData);
        
        console.log("--- NEW MESSAGE RECEIVED ---");
        console.log("Document ID: ", docRef.id);
        console.log(`From: ${name} (${email})`);
        
        // 10. Send success response back to the frontend
        res.status(200).json({ 
            success: true, 
            message: 'Message sent! I\'ll get back to you soon.' 
        });

    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error. Message could not be saved.' 
        });
    }
});

// 11. Start the server
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});