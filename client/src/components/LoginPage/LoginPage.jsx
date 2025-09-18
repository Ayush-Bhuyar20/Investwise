// src/components/LoginPage/LoginPage.jsx
import './LoginPage.css';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function LoginPage() {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome to InvestWise</h2>
        <p>Please sign in to continue</p>
        <button onClick={handleGoogleSignIn} className="google-signin-button">
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;