const config = require('../config/default');
const Client = require('./client');
const net = require('net');
const global = require('./globals');


/**
 * Death By Captcha Socket API Client.
 */
class SocketClient extends Client {

    /**
     *
     * @param cmd
     * @param payload
     * @param headers
     * @param files
     * @param cb
     * @private
     */
    _call({cmd, payload = {}, headers = {}, files = null}, cb) {

        payload['cmd'] = cmd;
        payload['version'] = config.API_VERSION;

        const options = {
            host: config.HTTP_BASE_URL,
            // port: getRandomInt(8123, 8130)
            port: 8123
        };

        if (files) {
            for (let file_key in files) {
                payload[file_key] = files[file_key];
            }

        }


        const request = JSON.stringify(payload) + config.TERMINATOR;

        let need_login = (cmd !== 'login');

        const login_request_token = JSON.stringify({
            'cmd': 'login',
            'authtoken': this.userpwd['authtoken']
        }) + config.TERMINATOR;

        const login_request = JSON.stringify({
            'cmd': 'login',
            'username': this.userpwd['username'],
            'password': this.userpwd['password']
        }) + config.TERMINATOR;

        const socket = net.createConnection(options, () => {
            if (need_login && (this.userpwd['username'] === "authtoken")) {
                socket.write(login_request_token, 'utf8');
            } else if (need_login && (this.userpwd['username'] !== "authtoken")) {
                socket.write(login_request, 'utf8');
            } else {
                socket.write(request, 'utf8');
            }

        });

        socket.on('error', (err) => {
            throw new Error(err.message);
        });

        let data = '';
        socket.on('data', (chunk) => {
            data += chunk;
            if (data.includes(config.TERMINATOR)) {
                if (need_login) {
                    need_login = false;
                    data = '';
                    socket.write(request, 'utf8');
                } else {
                    socket.end();
                    try {
                        var result = JSON.parse(data.trimRight(config.TERMINATOR));
                    } catch (err) {
                        throw new Error('Invalid API response');
                    }
                    if (result['error']) {
                        if (result['error'] === 'not-logged-in' || result['error'] === 'invalid-credentials') {
                            throw new Error('Access denied, check your credentials');
                        } else if (result['error'] === 'banned') {
                            throw new Error('Access denied, account is suspended');
                        } else if (result['error'] === 'insufficient-funds') {
                            throw new Error('CAPTCHA was rejected due to low balance');
                        } else if (result['error'] === 'invalid-captcha') {
                            throw new Error('CAPTCHA is not a valid image');
                        } else if (result['error'] === 'service-overload') {
                            throw new Error('CAPTCHA was rejected due to service overload, try again later');
                        } else {
                            throw new Error('API server error ocurred: ' + result['error']);
                        }
                    } else {
                        if (cmd === 'user') {
                            cb(result['user'] ? result : {'user': 0});
                        } else if (cmd === 'upload') {
                            cb(result['captcha'] ? result : null);
                        } else if (cmd.includes('report')) {
                            cb(result['is_correct'] ? !result['is_correct'] : null);
                        } else {
                            cb(result['captcha'] ? result : {'captcha': 0});
                        }
                    }
                }
            }
        });
    };


    /**
     *
     * @param cb
     */
    get_user(cb) {
        // Fetch user details -- ID, balance, rate and banned status.
        const params = {
            'cmd': 'user',
            'payload': this.userpwd,
        };
        this._call(params, cb);
    };


    /**
     *
     * @param cid
     * @param cb
     */
    get_captcha(cid, cb) {
        // Fetch a captcha details -- ID, text and correctness flag.
        const params = {
            'cmd': 'captcha',
            'payload': {
                'captcha': cid
            }
        };
        this._call(params, cb);
    };


    /**
     *
     * @param cid
     * @param cb
     */
    report(cid, cb) {
        // Report a captcha as incorrectly solved.
        var payload = this.userpwd;
        payload['captcha'] = cid;
        const params = {
            'cmd': 'report',
            'payload': payload
        };
        this._call(params, cb);
    };


    /**
     *
     * @param captcha
     * @param extra
     * @param cb
     */
    upload({captcha = null, extra = {}}, cb) {

        // Upload a CAPTCHA.

        // Accept file names and file-like objects. Return CAPTCHA details
        // JSON on success.

        const banner = (extra.banner ? extra.banner : null);
        var files = {};
        if (captcha) {
            files['captcha'] = global.load_image(captcha);
        }

        if (banner) {
            files['banner'] = global.load_image(banner);
        }

        var payload = this.userpwd;
        for (var entry in extra) {
            if (entry !== 'banner') {
                payload[entry] = extra[entry];
            }

        }

        const params = {
            'cmd': 'upload',
            'payload': payload,
            'files': files
        };
        this._call(params, cb);
    };

}


module.exports = SocketClient;