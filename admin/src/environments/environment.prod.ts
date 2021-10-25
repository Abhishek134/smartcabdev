export const environment = {
    production: true,
    firebase: {

        //    --- NEW SMARTCAB CONFIG---
        apiKey: "AIzaSyCmOJdzXIavL61ogrq1TuUDKggKHRLGHsQ",
        authDomain: "smartcabs-673a4.firebaseapp.com",
        databaseURL: "https://smartcabs-673a4-default-rtdb.firebaseio.com",
        projectId: "smartcabs-673a4",
        storageBucket: "smartcabs-673a4.appspot.com",
        messagingSenderId: "153864539731",
        appId: "1:153864539731:web:4514c434257d433b6c80a6",
        measurementId: "G-YP3PT476TB"
    },
    adminEmail: 'babumotorsug@gmail.com' // you need to create new account in firebase auth manually
};

export let EMAIL_VERIFICATION_ENABLED = true; // send verification email after user register
export let AUDIO_PATH = './assets/audio/sound.mp3'; // must have mp3 file

export let DEFAULT_AVATAR = './assets/img/default-dp.png';
