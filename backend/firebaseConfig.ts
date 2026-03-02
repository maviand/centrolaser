import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables if running in node (like tests)
if (typeof process !== 'undefined' && process.env) {
    dotenv.config();
}

const firebaseConfig = {
    apiKey: import.meta.env?.VITE_GCP_API_KEY || process.env.GCP_API_KEY,
    // Note: For a complete production setup, authDomain, projectId, storageBucket, etc. 
    // would be populated here. For this implementation demo focusing on the DB driver,
    // we initialize with the provided API Key and a placeholder project ID.
    projectId: "centro-laser-os"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
