import { useEffect, useState } from "react";
import { auth, firestore } from "../lib/firebaseConfig"; // Ensure this is correctly imported
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import styles from '../styles/dashboard.module.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for user authentication
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAvailability(currentUser.uid); // Fetch the current availability status
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [router]);

  const fetchAvailability = async (userId) => {
    const docRef = doc(firestore, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setAvailability(docSnap.data().availability);
    } else {
      console.log("No such document!");
    }
  };

  const updateAvailability = async () => {
    const newAvailability = !availability;
    setAvailability(newAvailability);

    // Correctly reference 'firestore' and use 'setDoc' with the 'merge' option
    await setDoc(doc(firestore, "users", user.uid), { availability: newAvailability }, { merge: true });
  };

  const logout = async () => {
    await auth.signOut();
    router.push("/signin");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.label}>{`User ID: ${user ? user.uid : ""}`}</p>
        <label className={styles.switch}>
          <input type="checkbox" checked={availability} onChange={updateAvailability} />
          <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
        <button onClick={logout} className={styles.button}>Logout</button>
      </div>
    </div>
  );
}