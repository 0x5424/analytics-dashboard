/* @refresh reload */
import { render } from 'solid-js/web';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';

import { firebaseApp } from './utils/firebase-app';
import { auth } from './utils/auth'

import './index.css';
import App from './App';

if (!auth.currentUser) {
  console.log('[firebaseui] Attempting to initialize ui')
  const ui = new firebaseui.auth.AuthUI(auth);

  ui.start('#root', {
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
        disableSignup: firebaseui.auth.DisableSignUpConfig
      }
    ]
  });
} else {
  render(() => <App />, document.getElementById('root') as HTMLElement);
}

