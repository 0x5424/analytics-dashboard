import { firebaseApp } from './firebase-app'
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const exportDb = (includeEmulators: boolean) => {
  const db = getDatabase(firebaseApp)

  if (includeEmulators) {
    console.log('[firebase/database] Connecting to emulator')
    connectDatabaseEmulator(db, 'localhost', 9000)
  }

  return db
}

export const db = exportDb(location.hostname === 'localhost')
