const config = require('../config/default');


/**
 * Death by Captcha API Client
 *
 * Base class for HttpClient and SocketClient classes
 */
class Client {

    /**
     * Constructor method which accepts:
     *
     * @param username
     * @param password
     */
    constructor(username, password) {
        if (username === 'authtoken') {
            console.log('using authtoken');
            this.userpwd = {
                'username': username,
                'authtoken': password
            };
        } else {
            console.log('using username/password');
            this.userpwd = {
                'username': username,
                'password': password
            };
        }
    };


    /**
     * Get User balance
     *
     * @param cb
     */
    get_balance(cb) {
        // Fetch user balance (in US cents).
        this.get_user((user) => {
            cb(user ? user['balance'] : null);
        });
    };


    /**
     * Get Captcha text
     *
     * @param cid
     * @param cb
     */
    get_text(cid, cb) {
        // Fetch a CAPTCHA text.
        this.get_captcha(cid, (captcha) => {
            cb(captcha ? captcha['text'] : null);
        });
    };


    /**
     * Try to solve a CAPTCHA.
     *
     * See Client.upload() for arguments details.
     *
     * Uploads a CAPTCHA, polls for its status periodically with arbitrary
     * timeout (in seconds), returns CAPTCHA details if (correctly) solved.
     *
     * @param captcha
     * @param timeout
     * @param extra
     * @param cb
     */
    decode({captcha = null, timeout = null, extra = {}}, cb) {


        if (!timeout) {
            if (!captcha) {
                timeout = config.DEFAULT_TOKEN_TIMEOUT;
            } else {
                timeout = config.DEFAULT_TIMEOUT;
            }
        }

        const deadline = Date.now() + (0 < timeout ? timeout : config.DEFAULT_TIMEOUT) * 1000;

        this.upload({captcha: captcha, extra: extra}, (uploaded_captcha) => {
            if (uploaded_captcha) {
                const intvl_idx = 0;
                (function poll_interval(client, deadline, idx, captcha, cb) {

                    if ((deadline > Date.now()) && (!captcha['text'])) {
                        let intvl;

                        if (config.POLLS_INTERVAL.length > idx) {
                            intvl = config.POLLS_INTERVAL[idx] * 1000;
                        }
                        else {
                            intvl = config.DFLT_POLL_INTERVAL * 1000;
                        }

                        setTimeout(() => {
                            client.get_captcha(captcha['captcha'], (uploaded_captcha) => {
                                poll_interval(client, deadline, idx + 1, uploaded_captcha, cb)
                            })
                        }, intvl);
                    } else if (captcha['text'] && captcha['is_correct']) {
                        cb(captcha);
                    } else cb(null);
                })(this, deadline, intvl_idx, uploaded_captcha, cb);
            } else {
                cb(null);
            }

        });
    };

}


module.exports = Client;