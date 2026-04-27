import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDmnpPOrGbMBA9dc74egd_0QiByqTqf6ps',
  authDomain: 'coach-connect-2a231.firebaseapp.com',
  projectId: 'coach-connect-2a231',
  storageBucket: 'coach-connect-2a231.firebasestorage.app',
  messagingSenderId: '681549273754',
  appId: '1:681549273754:web:e4cb8a890e93cd0ae61d23'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
