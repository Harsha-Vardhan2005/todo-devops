const admin = require('firebase-admin');

// Initialize Firebase Admin with better error handling
let firebaseApp;

try {
  if (!admin.apps.length) {
    console.log('🔥 Initializing Firebase Admin...');
    
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };

    console.log('Firebase Project ID:', serviceAccount.projectId);
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('🔍 Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('✅ Token verified for user:', decodedToken.email);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid token: ' + error.message });
  }
};

module.exports = authMiddleware;