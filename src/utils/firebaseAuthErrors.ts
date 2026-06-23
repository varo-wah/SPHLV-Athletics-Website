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
      return 'Email/password login is not enabled in Firebase yet.';
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
