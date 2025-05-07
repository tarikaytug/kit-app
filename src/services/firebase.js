import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Kullanıcının favori kitaplarını Firestore'a ekleyen fonksiyon
export const addFavoriteBook = async (userId, book) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    await addDoc(favoritesRef, {
      userId,
      bookId: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      thumbnail: book.thumbnail,
      publishedDate: book.publishedDate,
      publisher: book.publisher,
      addedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding favorite book:', error);
    throw error;
  }
};

// Kullanıcının favori kitaplarını Firestore'dan almak için fonksiyon
export const getFavoriteBooks = async (userId) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting favorite books:', error);
    throw error;
  }
};

