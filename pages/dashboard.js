import { useEffect, useState } from "react";
import { auth, firestore } from "../lib/firebaseConfig"; // Ensure this is correctly imported
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

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
    <div>
      <h1>Dashboard</h1>
      <p>{`User ID: ${user ? user.uid : ""}`}</p>
      <label className="switch">
        <input type="checkbox" checked={availability} onChange={updateAvailability} />
        <span className="slider round"></span>
      </label>
      <button onClick={logout}>Logout</button>
      <style jsx>{`
        /* The switch - the box around the slider */
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        /* Hide default HTML checkbox */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        /* The slider */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #2196F3;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
