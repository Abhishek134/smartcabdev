export const environment = {
    production: true,
    appName: 'Babu',
    firebase: {

        //    --- NEW SMARTCAB FIREBASE CONFIG---
        apiKey: "AIzaSyCmOJdzXIavL61ogrq1TuUDKggKHRLGHsQ",
        authDomain: "smartcabs-673a4.firebaseapp.com",
        databaseURL: "https://smartcabs-673a4-default-rtdb.firebaseio.com",
        projectId: "smartcabs-673a4",
        storageBucket: "smartcabs-673a4.appspot.com",
        messagingSenderId: "153864539731",
        appId: "1:153864539731:web:cde8a25b7d0bafd16c80a6",
        measurementId: "G-G3M6WBWG4X"
    },
    langArr: [
        {name: 'English', code: 'en'},
        {name: 'española', code: 'es'},
        {name: 'عربى', code: 'ar'},
        {name: '中文', code: 'cn'}
    ]
};

export let POSITION_INTERVAL = 5000; // 5000ms for refreshing geolocation

export let DRIVER_INIT_BALANCE = 0.00; // balance when user signed up for first time
export let DRIVER_INIT_RATING = 0; // rating when user signedup for first time
export let  TRIP_PER_MINUTE_CHARGE = 200;

export let DEAL_STATUS_PENDING = 'pending';
export let DEAL_STATUS_ACCEPTED = 'accepted';
export let DEAL_TIMEOUT = 20; // 20 seconds

export let TRIP_STATUS_WAITING = 'waiting';
export let TRIP_STATUS_GOING = 'going';
export let TRIP_STATUS_FINISHED = 'finished';
export let TRIP_STATUS_CANCELED = 'canceled';
export let TRANSACTION_TYPE_WITHDRAW = 'withdraw';
export let TRANSACTION_TYPE_DEPOSIT = 'deposit';
export let TRANSACTION_TYPE_CASHLESS = 'cashless_deposit';

export let EMAIL_VERIFICATION_ENABLED = true; // send verification email after user register
export let APPROVAL_REQUIRED = false; // driver can ride without any approval
export let CURRENCY_SYMBOL = 'UGX';
export let PLAY_AUDIO_ON_REQUEST = true;
export let ENABLE_SIGNUP = true;

export let AUDIO_PATH = './assets/audio/sound.mp3'; // must have mp3 file
export let AUDIO_PATH2 = './assets/audio/note.mp3'; // must have mp3 file

// === Perez Audio

export let AUDIO_PATH3 = './assets/audio/1.mp3'; // must have mp3 file
export let AUDIO_PATH4 = './assets/audio/2.mp3'; // must have mp3 file
export let AUDIO_PATH5 = './assets/audio/3.mp3'; // must have mp3 file
export let AUDIO_PATH6 = './assets/audio/4.mp3'; // must have mp3 file
export let AUDIO_PATH55 = './assets/audio/lovely.mp3'; // must have mp3 file

export let DEFAULT_AVATAR = './assets/img/default-dp.png';
export let CUSTOMER_CARE = '+256709007168';
