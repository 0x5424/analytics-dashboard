import {firebaseApp} from './firebase-app'
import {
  get,
  set,
  ref,
  push,
  child,
  onValue,
  getDatabase,
  connectDatabaseEmulator,
  serverTimestamp,
} from 'firebase/database'

const exportDb = (includeEmulators: boolean) => {
  const db = getDatabase(firebaseApp)

  if (includeEmulators) {
    console.log('[firebase/database] Initializing emulator')
    connectDatabaseEmulator(db, 'localhost', 9000)
  }

  return db
}

export const db = exportDb(location.hostname === 'localhost')

export const listenTalents = (mutate) => {
  const talentsRef = ref(db, 'talents/')

  onValue(talentsRef, (snapshot) => {
    mutate(snapshot.val())
  });
}

export const createTalent = (name) => {
  const payload = {
    name,
    timestamp: serverTimestamp(),
    created_at: serverTimestamp(),
  }

  const id = push(child(ref(db), 'talents')).key
  set(child(ref(db), `talents/${id}`), payload)

  // Return value directly to save a DB hit
  return {id, ...payload}
}
