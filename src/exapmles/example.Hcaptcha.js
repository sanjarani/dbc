/*
* Death by Captcha Node.js API hcaptcha usage example
*/

const dbc = require('../deathbycaptcha');

const username = 'username';     // DBC account username
const password = 'password';     // DBC account password
const token_from_panel = 'your-token-from-panel';   // DBC account authtoken

// Proxy and hcaptcha token data
const hcaptcha_params = JSON.stringify({
    'proxy': 'http://username:password@proxy.example:3128',
    'proxytype': 'HTTP',
    'sitekey': '56489210-0c02-58c0-00e5-1763b63dc9d4',
    'pageurl': 'https://client-demo.testsite.com/test-hcaptcha'
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

// Solve captcha with type 7 & token_params extra arguments
client.decode({extra: {type: 7, hcaptcha_params: hcaptcha_params}}, (captcha) => {

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

});
