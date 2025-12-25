import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase services are automatically configured by the Firebase module
// Make sure to add your google-services.json (Android) and GoogleService-Info.plist (iOS) files

export const firebaseAuth = auth;
export const firebaseFirestore = firestore;

// Helper functions for Firebase operations
export const getCurrentUser = () => {
  return auth().currentUser;
};

export const signOutUser = () => {
  return auth().signOut();
};

// Authentication functions
export const signInUser = async (email: string, password: string) => {
  try {
    const result = await auth().signInWithEmailAndPassword(email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Firestore functions
export const createUserDocument = async (userId: string, userData: any) => {
  try {
    await firestore().collection('users').doc(userId).set(userData);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUserDocument = async (userId: string) => {
  try {
    const doc = await firestore().collection('users').doc(userId).get();
    if (doc.exists) {
      return { data: doc.data(), error: null };
    }
    return { data: null, error: 'User not found' };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export default {
  auth: firebaseAuth,
  firestore: firebaseFirestore,
  getCurrentUser,
  signOutUser,
  signInUser,
  registerUser,
  createUserDocument,
  getUserDocument,
};
