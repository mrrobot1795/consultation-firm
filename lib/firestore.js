import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const updateUserAvailability = async (userId, availability) => {
  await setDoc(doc(db, "users", userId), { availability }, { merge: true });
};
