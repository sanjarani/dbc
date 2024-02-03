/*
* Death by Captcha Node.js API keycaptcha usage example
*/

const dbc = require('../deathbycaptcha');

const username = 'username';     // DBC account username
const password = 'password';     // DBC account password
const token_from_panel = 'your-token-from-panel';   // DBC account authtoken

// Proxy and keycaptcha token data
const keycaptcha_params = JSON.stringify({
    'proxy': 'http://username:password@proxy.example:3128',
    'proxytype': 'HTTP',
    's_s_c_user_id': 'valid_UID',
    's_s_c_session_id': 'valid_session_ID',
    's_s_c_web_server_sign': 'valid_webserver_sign',
    's_s_c_web_server_sign2': 'valid_webserver_sign2',
    'pageurl': 'https://client-demo.testsite.com/test-keycaptcha'
});

// Death By Captcha Socket Client
// const client = new dbc.SocketClient(username, password);
// Death By Captcha http Client
const client = new dbc.HttpClient(username, password);

// To use token authentication the first parameter must be "authtoken"
// const client = new dbc.HttpClient("authtoken", token_from_panel);

// Get user balance
client.get_balance((balance) => {
    console.log(balance);
});

// Solve captcha with type 10 & token_params extra arguments
client.decode({extra: {type: 10, keycaptcha_params: keycaptcha_params}}, (captcha) => {

    if (captcha) {
        console.log('Captcha ' + captcha['captcha'] + ' solved: ' + captcha['text']);

        /*
        * Report an incorrectly solved CAPTCHA.
        * Make sure the CAPTCHA was in fact incorrectly solved!
        * client.report(captcha['captcha'], (result) => {
        *   console.log('Report status: ' + result);
        * });
        */
    }

