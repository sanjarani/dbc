const dbc = require('@sanjarani/dbc');

const args = process.argv;

const username = "your-username";     // DBC account username
const password = "your-password";     // DBC account password
const clienttype = args[4];

let client;

if (clienttype === "HTTP"){
    console.log("Using http client");
    client = new dbc.HttpClient(username, password);
}
else {
    console.log("using sockets client")
    client = new dbc.SocketClient(username, password);
}

// Get user balance
client.get_balance((balance) => {
    console.log(balance);
});