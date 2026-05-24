import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBj9Fkt380PmdQD5EoZaynRhtxZMYlDLz0",
  authDomain: "afriview-f15c9.firebaseapp.com",
  projectId: "afriview-f15c9",
  storageBucket: "afriview-f15c9.firebasestorage.app",
  messagingSenderId: "590196968769",
  appId: "1:590196968769:web:955fb23e4787061e9f25c0",
  measurementId: "G-434KG9Y3TJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Destinations
export const fetchDestinations = async () => {
  const q = query(collection(db, 'destinations'), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addDestination = async (destinationData) => {
  const docRef = await addDoc(collection(db, 'destinations'), destinationData);
  return { id: docRef.id, ...destinationData };
};

export const updateDestination = async (id, destinationData) => {
  const docRef = doc(db, 'destinations', id);
  await updateDoc(docRef, destinationData);
  return { id, ...destinationData };
};

export const deleteDestination = async (id) => {
  const docRef = doc(db, 'destinations', id);
  await deleteDoc(docRef);
  return { message: 'Destination deleted' };
};

// Tours
export const fetchTours = async () => {
  const q = query(collection(db, 'tours'), orderBy('title'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTour = async (tourData) => {
  const docRef = await addDoc(collection(db, 'tours'), tourData);
  return { id: docRef.id, ...tourData };
};

export const updateTour = async (id, tourData) => {
  const docRef = doc(db, 'tours', id);
  await updateDoc(docRef, tourData);
  return { id, ...tourData };
};

export const deleteTour = async (id) => {
  const docRef = doc(db, 'tours', id);
  await deleteDoc(docRef);
  return { message: 'Tour deleted' };
};

// Auth exports
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, sendEmailVerification, db };

// Bookings
export const addBooking = async (bookingData) => {
  const docRef = await addDoc(collection(db, 'bookings'), bookingData);
  return { id: docRef.id, ...bookingData };
};
// Users collection
export const upsertUser = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { role: 'guest', ...userData }, { merge: true });
  return { uid, ...userData };
};



