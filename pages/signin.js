import { useState } from "react";
import { useRouter } from 'next/router'; // Import useRouter
import { auth } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
  const router = useRouter(); // Create a router instance

  const createUserInTalkJS = async (user) => {
    try {
      const response = await fetch('/api/talkjs/createUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              id: user.uid, // Use UID from Firebase Auth as TalkJS ID
              name: user.displayName || email, // Use displayName or fallback to email
              email: user.email,
              // photoUrl: user.photoURL, Uncomment or add this if you manage user photos
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to create or update user in TalkJS');
      }

      return await response.json();
    } catch (error) {
      console.error("TalkJS user creation failed:", error);
      setErrorMessage("Failed to initialize chat service.");
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);

      // Now, create or update the user in TalkJS
      await createUserInTalkJS(userCredential.user);

      router.push('/dashboard'); // Redirect to dashboard after TalkJS update
    } catch (error) {
      console.error("Error signing in:", error.message);
      setErrorMessage(error.message); // Display an error message to the user
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>} {/* Display any error messages */}
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
