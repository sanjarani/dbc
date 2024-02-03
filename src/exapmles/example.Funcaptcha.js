/*
* Death by Captcha Node.js API funcaptcha usage example
*/

const dbc = require('../deathbycaptcha');

const username = 'username';     // DBC account username
const password = 'password';     // DBC account password
const token_from_panel = 'your-token-from-panel';   // DBC account authtoken

// Proxy and funcaptcha data
const funcaptcha_params = JSON.stringify({
    'proxy': 'http://user:password@127.0.0.1:1234',
    'proxytype': 'HTTP',
    'publickey': '029EF0D3-41DE-03E1-6971-466539B47725',
    'pageurl': 'https://client-demo.testsite.com/test-funcaptcha'
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

// Solve captcha with type 6 & funcaptcha_params extra arguments
client.decode({extra: {type: 6, funcaptcha_params: funcaptcha_params}}, (captcha) => {

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
