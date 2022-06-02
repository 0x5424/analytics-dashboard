import type {Component} from 'solid-js'
import {ref, get} from 'firebase/database'

import styles from './App.module.css'

import {db} from './utils/database'

// Test db connection
await get(ref(db)).then(() => {
  console.log('[firebase/database] Connected to DB successfully')
}).catch((err) => {
  console.error('[firebase/database] Failed to connect--error:', err)
})

/* COMPONENTS */
import {Talent} from './components/Talent'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Talent />
    </div>
  )
}

export default App
