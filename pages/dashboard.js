// pages/dashboard.js
import { useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for user authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchAvailability(user.uid); // Fetch the current availability status
      } else {
        router.push("/signin");
      }
    });

    return unsubscribe; // Cleanup subscription
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

    await setDoc(doc(firestore, "users", user.uid), { availability: newAvailability });
  };

  const logout = async () => {
    await auth.signOut();
    router.push("/signin");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{`User ID: ${user ? user.uid : ""}`}</p>
      <label>
        <input type="checkbox" checked={availability} onChange={updateAvailability} />
        Available
      </label>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
