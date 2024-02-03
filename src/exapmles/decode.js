const dbc = require('@sanjarani/dbc');


const username = "your-username";     // DBC account username
const password = "your-password";     // DBC account password

let client;
let img = '../images/normal.jpg';

client = new dbc.SocketClient(username, password);

// decode a normal captcha
client.decode({
    captcha: img,
    timeout: 30
}, (response) => {
    console.log(response);
});


/**
 *     // {
 *     //     captcha: captcha id, -> i.e 100629041
 *     //     text:  captcha text -> i.e "3t9y",
 *     //     is_correct: true,
 *     //     status: 0
 *     // }
 */