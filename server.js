// 1. Import Express
const express = require('express');
const app = express();
const PORT = 3000;

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

// 6. Tell Express how to read data from a form
// This middleware is for 'application/x-www-form-urlencoded' (our form)
app.use(express.urlencoded({ extended: true }));

// This middleware is for 'application/json' (we'll need this later)
app.use(express.json());

// This middleware allows your server to be called from other websites (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any website to call
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 7. Create a "route" for the homepage (/)
app.get('/', (req, res) => {
  res.send('Our backend server (with database!) is running! 🚀');
});

// 8. Create a new route that LISTENS for POST requests
app.post('/submit-scam-form', async (req, res) => {
    
    // 'req.body' will contain the form data
    const formData = req.body;
    
    try {
        // 9. SAVE the data to the database
        // We create a new "document" (a new entry)
        // inside a "collection" named "submissions"
        const docRef = await db.collection('submissions').add(formData);
        
        console.log("--- NEW SUBMISSION SAVED ---");
        console.log("Document written with ID: ", docRef.id);
        console.log(formData);
        
        // 10. *** THIS IS THE CHANGE ***
        // Instead of redirecting, just send a "200 OK" success message.
        // The new JavaScript in input.html will catch this.
        res.status(200).json({ message: 'Data saved successfully!' });

    } catch (error) {
        console.error("Error adding document: ", error);
        // Send a "500 Internal Server Error" message
        res.status(500).json({ message: 'Error saving data' });
    }
});

// 11. Start the server
app.listen(PORT, () => {
  console.log(`Server is live and listening on http://localhost:${PORT}`);
});