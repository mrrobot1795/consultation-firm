import { useState } from "react";
import { auth, firestore } from "../lib/firebaseConfig"; // Ensure this path matches your project structure
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/router'; // Import useRouter
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Use the useRouter hook

  const signUp = async () => {
    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);

      // Add or update the user's data in the Firestore 'users' collection
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        // You can add more fields here as needed, such as 'createdAt', 'role', etc.
      });

      console.log("User profile created/updated in Firestore");
      
      // Redirect to dashboard page after successful signup
      router.push('/dashboard'); // Use the router object to navigate
    } catch (error) {
      console.error("Error during sign up or adding user to Firestore:", error.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={signUp}>Sign Up</button>
      <Link href="/signin">Already have an account? Sign in</Link>
    </div>
  );
}
