import {firebaseApp} from './firebase-app'
import {getAuth, connectAuthEmulator} from 'firebase/auth'

const exportAuth = (includeEmulators: boolean) => {
  const auth = getAuth(firebaseApp)

  if (includeEmulators) {
    console.log('[firebase/auth] Initializing emulator')
    connectAuthEmulator(auth, 'http://localhost:9099')
  }

  return auth
}

export const auth = exportAuth(location.hostname === 'localhost')
