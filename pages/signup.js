import { useState } from "react";
import { auth } from "../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={signUp}>Sign Up</button>
      <Link href="/signin">Already have an account? Sign in</Link>
    </div>
  );
}
