import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Our Web App!</h1>
      <p>Get started by signing in or creating an account.</p>
      <div>
        <Link href="/signin"><a>Sign In</a></Link>
        <br></br>
        <Link href="/signup"><a>Sign Up</a></Link>
      </div>
    </div>
  );
}
