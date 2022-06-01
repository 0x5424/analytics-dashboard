import type { Component } from 'solid-js';
import { ref, get } from "firebase/database";

import logo from './logo.svg';
import styles from './App.module.css';

import { db } from './utils/database'

// Test db connection
await get(ref(db)).then((snapshot) => {
  console.log('LOGGING DB VALUE:', snapshot.val())
}).catch((err) => {
  console.error('Failed to connect to db; error:', err)
})

/* COMPONENTS */
import { Example } from './components/Example'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <nav>
        <ul class={styles.list}>
          <li>Talent1</li>
          <li>Talent_XX</li>
          <li>Talent_XX</li>
          <li>Talent_XX</li>
        </ul>
      </nav>
      <Example />
    </div>
  );
};

export default App;
