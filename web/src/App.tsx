import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

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
