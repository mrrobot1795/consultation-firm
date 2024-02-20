import { useEffect, useState, useRef } from "react";
import { auth, firestore } from "../lib/firebaseConfig"; // Assuming your Firestore instance is named 'db'
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Talk from 'talkjs';
import styles from '../styles/dashboard.module.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState(false);
  const router = useRouter();
  const chatContainerRef = useRef(null); // Ref for mounting TalkJS chat

  useEffect(() => {
    // Check for user authentication and initialize TalkJS
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAvailability(currentUser.uid); // Fetch the current availability status
        await initializeTalkJS(currentUser); // Initialize TalkJS
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
    await setDoc(doc(firestore, "users", user.uid), { availability: newAvailability }, { merge: true });
  };

  const logout = async () => {
    await auth.signOut();
    router.push("/signin");
  };

  const initializeTalkJS = async (currentUser) => {
    // Ensure TalkJS has loaded
    if (!window.Talk || !currentUser) {
      return;
    }

    // Initialize TalkJS
    await Talk.ready;
    const me = new Talk.User({
      id: currentUser.uid,
      name: currentUser.displayName || "Anonymous User",
      email: currentUser.email,
      photoUrl: currentUser.photoURL,
      welcomeMessage: "Hi there! How can I help you?",
    });

    if (!window.talkSession) {
      window.talkSession = new Talk.Session({
        appId: tS8wZOif, // Replace with your actual TalkJS App ID
        me: me,
      });
    }

    const conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(me, me));
    conversation.setParticipant(me);

    const chatbox = window.talkSession.createChatbox(conversation);
    chatbox.mount(chatContainerRef.current);
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
        <div ref={chatContainerRef} className={styles.chatContainer}></div> {/* TalkJS chat container */}
      </div>
    </div>
  );
}
