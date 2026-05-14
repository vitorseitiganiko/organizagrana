import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDMecLimknKaDCwko6vcsndShJ3U0s2OVE',
  authDomain: 'organizagrana-912a0.firebaseapp.com',
  projectId: 'organizagrana-912a0',
  storageBucket: 'organizagrana-912a0.firebasestorage.app',
  messagingSenderId: '575132215826',
  appId: '1:575132215826:web:d4ea9754da52edacf086cb',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
