# [Death by Captcha][dbc-target] HTTP and Socket [API][api-target] clients.
![node-lts (scoped)](https://img.shields.io/node/v-lts/%40sanjarani/dbc?style=for-the-badge&logo=javascript&label=%40sanjarani%2Fdbc&color=%234b9fcc)
![node-current](https://img.shields.io/node/v/npm?style=for-the-badge)

## Solve and bypass All kind of captcha :

1. <span class="g">✔</span> Normal image captcha
2. <span class="g">✔</span> Text Captcha
3. <span class="g">✔</span> reCAPTCHA Coordinates

3. <span class="g">✔</span> reCAPTCHA Image Group

5. <span class="g">✔</span> reCAPTCHA V2
6. <span class="g">✔</span> reCAPTCHA V3
7. <span class="g">✔</span> Amazon WAF
8. <span class="g">✔</span> HCAPTCHA
9. <span class="g">✔</span> Audio Captcha
10. <span class="g">✔</span> Capy Captcha
11. <span class="g">✔</span> Fun Captcha
12. <span class="g">✔</span> Geetest CAPTCHA V3
13. <span class="g">✔</span> Geetest CAPTCHA V4
14. <span class="g">✔</span> KeyCaptcha
15. <span class="g">✔</span> Lemin
16. <span class="g">✔</span> Siara
17. <span class="g">✔</span> Turnstile

Find more info on example and images [folders](https://www.npmjs.com/package/@sanjarani/dbc?activeTab=code).

## [Register to DeathByCaptcha][register-target] first to get access.  



A [simple](#simple-and-fast-example-using-decode-) and lightweight library to use deathbycaptcha api.


## Install

```
npm install @sanjarani/dbc
```

## Usage:

Just call `HttpClient` or `SocketClient` class based on your prefer connection and call methods:

```javascript
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
```

<br>
<br>

## Available methods:
There are two types of Death by Captcha (DBC hereinafter) API:

_HTTP_ and _Socket_ ones.

Both offer the same functionalily, with the _**socket API**_
sporting **faster responses** and using way less connections.

To access the Socket API, use SocketClient class; for the HTTP API, use
HttpClient class.


<br>



### Both _SocketClient_ and _HttpClient_ give you the following methods:

## get_user
```javascript
 get_user((user) => {})
```

Returns your DBC account details as a JSON with the following keys :

```
{
    "user": {},
    // your account numeric ID; if login fails, it will be the only item with the value of 0;
            
    "rate": {},
    // your CAPTCHA rate, i.e. how much you will be charged for one solved CAPTCHA in US cents;
            
    "balance": {}, 
    // your DBC account balance in US cents;
        
    "is_banned": {} 
    // flag indicating whether your account is suspended or not.
}
```
<br>

## get_balance
```javascript
get_balance((balance) => {})
```

Returns your DBC account balance in US cents (null for invalid user).
```
// example : 
224.1401
```
<br>

## get_captcha

```javascript
get_captcha(cid, (captcha) => {})
//The only argument `cid` is the CAPTCHA numeric ID.
```

Returns an uploaded CAPTCHA details as a JSON with the following keys:
```
{
    "captcha": {},
     // the CAPTCHA numeric ID; if no such CAPTCHAs found, it will be the only item with the value of 0;
     
    "text": {},
     // the CAPTCHA text, if solved, otherwise None;
     
    "is_correct": {}
     // flag indicating whether the CAPTCHA was solved correctly (DBC can detect that in rare cases).
}
```

<br><br>
## get_text

```javascript
get_text(cid, (text) => {}) 
// The only argument `cid` is the CAPTCHA numeric ID.
```

Returns an uploaded CAPTCHA text (null if not solved).


<br><br>
## report

```javascript
report(cid, (success) => {})
// The only argument `cid` is the CAPTCHA numeric ID.
``` 
Reports an _incorrectly_ solved **CAPTCHA**.

Returns ***true*** on success, ***false*** otherwise.

<br>

## upload

```javascript
upload({ captcha = null, extra = {} }, (captcha) => {}) 
// The only argument `captcha` is the CAPTCHA image file name.
```

Uploads a CAPTCHA.

On successul upload you'll get the CAPTCHA details JSON

see [get_captcha()](#get_captcha) method.

>NOTE: AT THIS POINT THE UPLOADED CAPTCHA IS NOT SOLVED YET!  
> You have to poll for its status periodically using [get_captcha()](#get_captcha) or [get_text()](#get_text) method until the CAPTCHA is solved and you get the text.

<br>

## decode
```javascript
decode({ captcha = null, timeout = null, extra = {} }, (captcha) => {})
```

A convenient method that uploads a CAPTCHA and polls for its status
periodically, but no longer than `timeout` (defaults to 60 seconds).

If solved, you'll get the CAPTCHA details JSON (see [get_captcha()](#get_captcha) method for details).  See upload() method for details on `captcha`
argument.

### Simple and fast example using decode :

Select `HttpClient` or `SocketClient` first, and then call **decode** method using `image path` and `timeout`:

```javascript
const dbc = require('@sanjarani/dbc');

const username = "your-username";     // DBC account username
const password = "your-password";     // DBC account password

let client;
let img = '../images/normal.jpg';

client = new dbc.SocketClient(username, password);

// decode a captcha
client.decode({
    captcha: img,
    timeout: 30
}, (response) => {
    console.log(response);
});
```

The `response` object will return this result :
```json
{
  captcha: 1633458547, //"captcha id"
  text:  "captcha text",
  is_correct: true,
  status: 0
}
```

### Visit [http://www.deathbycaptcha.com/user/api][api-target] for updates.


## License

This module released under the **MIT** license.

## Author
[Kiyarash Sanjarani Vahed](mailto:kiyarash.sanjarani@gmail.com)


[dbc-target]: https://deathbycaptcha.com/?refid=1237319568a
[register-target]: https://deathbycaptcha.com/register?refid=6183846162b
[order-target]: https://deathbycaptcha.com/user-order?refid=1237319568a
[api-target]: https://deathbycaptcha.com/api?refid=32153798700c

<style>
.h {width:14px; height: 14px; color: green}
.g {color: green; font-size: 17px;}
</style>