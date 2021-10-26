export const environment = {
    production: true,
    appName: 'Babu',
    firebase: {

   
    },
    trackingURL: 'http://192.168.1.4:8080',
    langArr: [
        {name: 'English', code: 'en'},
        {name: 'española', code: 'es'},
        {name: 'عربى', code: 'ar'},
        {name: '中文', code: 'cn'}
    ]
};

export let SHOW_VEHICLES_WITHIN = 5; // within 5km
export let POSITION_INTERVAL = 10000; // 2000ms
export let VEHICLE_LAST_ACTIVE_LIMIT = 60000; // 60s

export let DEAL_STATUS_PENDING = 'pending';
export let DEAL_STATUS_ACCEPTED = 'accepted';
export let TRIP_STATUS_GOING = 'going';
export let TRIP_STATUS_FINISHED = 'finished';
export let TRIP_STATUS_CANCELED = 'canceled';
export let DEAL_TIMEOUT = 20000; // 20s

export let EMAIL_VERIFICATION_ENABLED = true; // send verification email after user register
export let ENABLE_SIGNUP = true;
export let SOS = '+256709007168';
export let DEFAULT_AVATAR = 'http://placehold.it/150x150';
export  let DRIVER_INIT_RATING =0;

export let AUDIO_PATH = './assets/audio/sound.mp3'; // must have mp3 file
export let AUDIO_PATH2 = './assets/audio/note.mp3'; // must have mp3 file
// export let AUDIO_PATH3 = './assets/audio/note.mp3'; // must have mp3 file

// === Perez Audio

export let AUDIO_PATH3 = './assets/audio/1.mp3'; // must have mp3 file
export let AUDIO_PATH4 = './assets/audio/2.mp3'; // must have mp3 file
export let AUDIO_PATH5 = './assets/audio/3.mp3'; // must have mp3 file
export let AUDIO_PATH6 = './assets/audio/4.mp3'; // must have mp3 file

export let PLAY_AUDIO_ON_REQUEST = true;

export let TRANSACTION_TYPE_DEPOSIT = 'deposit';
export let TRANSACTION_TYPE_CASHLESS = 'cashless_deposit';
