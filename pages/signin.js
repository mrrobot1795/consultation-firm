import { useState } from "react";
import { useRouter } from 'next/router'; // Import useRouter
import { auth } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Create a router instance

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error("Error signing in:", error.message);
      // Optionally, handle errors (e.g., show an error message)
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
      <button onClick={signIn}>Sign In</button>
      <Link href="/signup">Don&apos;t have an account? Sign up</Link>
    </div>
  );
}
