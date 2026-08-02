import { FirebaseError } from 'firebase/app';

export function getFirebaseAuthMessage(error: unknown, fallback: string) {
  if (!(error instanceof FirebaseError)) return fallback;

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'That email already has an account. Switch to sign in.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase yet.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/web-storage-unsupported':
      return 'This browser blocks the storage required for Google sign-in.';
    case 'auth/cancelled-popup-request':
      return 'Another sign-in window is already open.';
    case 'auth/account-exists-with-different-credential':
      return 'That email already uses a different sign-in method.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized for Firebase sign-in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    default:
      return `${fallback} (${error.code})`;
  }
}
