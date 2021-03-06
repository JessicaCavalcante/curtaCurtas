/* eslint-disable no-console */
/* eslint-disable no-alert */
import { onNavigate } from '../utils/history.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCm0WY8UlDv52OFu_IXzxoIATA2dMPJVYA',
  authDomain: 'curta-curtas.firebaseapp.com',
  projectId: 'curta-curtas',
  storageBucket: 'curta-curtas.appspot.com',
  messagingSenderId: '364432431987',
  appId: '1:364432431987:web:c840ee27c2841f5a3ec306',
  measurementId: 'G-270DDGLK4G',
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line semi
// const firebase.auth = firebase.firebase.auth()

export const signIn = (email, senha) => {
  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(() => {
      onNavigate('/home');
      const user = firebase.auth().currentUser;
      alert(`Welcome to Curta Curtas, ${user.displayName}!`);
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`${errorMessage}`);
    });
};

export const loginGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  console.log(provider);
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      onNavigate('/home');
      alert(`Welcome to Curta Curtas, ${firebase.auth().currentUser.displayName}!`);
      const user = firebase.auth.currentUser;
      const uid = user.uid;
      firebase.firestore().doc(`/users/${uid}`).set({
        email: user.email,
        name: user.displayName,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`${errorMessage}`);
    });
};
export const logOut = () => firebase.auth().signOut();

export const creatingAccountWithEmail = (username, email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('Sucesso', user);
      firebase.auth().currentUser.updateProfile({ displayName: username })
        .then(() => {
          onNavigate('/home');
        });
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

export const addFilm = (idFilm, titleFilm, posterFilm, type) => {
  const currentUserId = firebase.auth().currentUser.uid;
  const filmToAdd = firebase.firestore().collection('users').doc(currentUserId);
  let data = { [idFilm]: {
    id_film: idFilm,
    title_film: titleFilm,
    poster_film: posterFilm
  }};
  if (type == 'likes') {
    filmToAdd.set({
      user_id: currentUserId,
      likes: data
    }, { merge: true });
    removeFilm(idFilm, currentUserId, 'dislikes');
  }
  if (type == 'dislikes') {
    filmToAdd.set({
      user_id: currentUserId,
      dislikes: data
    }, { merge: true });
    removeFilm(idFilm, currentUserId, 'likes');
  }
  if (type == 'watchlist') {
    filmToAdd.set({
      user_id: currentUserId,
      watchlist: data
    }, { merge: true });
  }
};

const removeFilm = (idFilm, docId, type) => {
  firebase.firestore().collection('users').doc(docId)
    .update({
      [type + '.' + idFilm]: firebase.firestore.FieldValue.delete()
    })
    .then(() => {})
    .catch(() => {
      alert('Algo deu errado. Por favor, tente novamente.');
    });
}