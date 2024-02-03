const config = require('../config/default');
const FormData = require('form-data');
const Client = require('./client');
const global = require('./globals');


/**
 * Death by Captcha HTTP API client.
 */
class HttpClient extends Client {


    /**
     *
     * @param cmd
     * @param payload
     * @param headers
     * @param files
     * @param cb
     * @private
     */
    _call({cmd, payload = null, headers = {}, files = null}, cb) {

        let form = new FormData();

        let options = {
            protocol: 'http:',
            host: config.HTTP_BASE_URL,
            path: '/api/' + cmd
        };

        if (payload) {

            for (let entry in payload) {
                form.append(entry, payload[entry]);
            }

            if (files) {
                for (let file_key in files) {
                    form.append(file_key, files[file_key]);
                }
            }

            options['headers'] = form.getHeaders();

        } else {
            options['method'] = 'GET';
            options['headers'] = headers;
        }

        options['headers']['Accept'] = config.HTTP_RESPONSE_TYPE;
        options['headers']['User-Agent'] = config.API_VERSION;

        const request = form.submit(options, (err, response) => {
            if (err) {
                throw new Error(err.message);
            } else {
                switch (response.statusCode) {
                    case 200:
                    case 303:
                        let data = '';
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => {
                            data += chunk;
                        });
                        response.on('end', () => {
                            let result = JSON.parse(data);
                            if (cmd === 'user') {
                                cb(result['user'] ? result : {'user': 0});
                            } else if (cmd === 'captcha') {
                                cb(result['captcha'] ? result : null);
                            } else if (cmd.includes('report')) {
                                cb(!result['is_correct']);
                            } else {
                                cb(result['captcha'] ? result : {'captcha': 0});
                            }
                        });
                        break;
                    case 403:
                        throw new Error('Access denied, please check your credentials and/or balance');
                        break;
                    case 400:
                    case 413:
                        throw new Error('CAPTCHA was rejected by the service, check if i\'s a valid image');
                        break;
                    case 503:
                        throw new Error('CAPTCHA was rejected due to service overload, try again later');
                        break;
                    default:
                        throw new Error('Invalid API response');
                }

            }

        });
    };


    /**
     *
     * @param cb
     */
    get_user(cb) {
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
            'cmd': 'captcha/' + cid,
        };
        this._call(params, cb);
    }


    /**
     *
     * @param cid
     * @param cb
     */
    report(cid, cb) {
        // Report a captcha as incorrectly solved.
        const params = {
            'cmd': 'captcha/' + cid + '/report',
            'payload': this.userpwd,
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
        let files = {};
        if (captcha) {
            files['captchafile'] = 'base64:' + global.load_image(captcha);
        }

        if (banner) {
            files['banner'] = 'base64:' + global.load_image(banner);
        }

        let payload = this.userpwd;

        for (let entry in extra) {
            payload[entry] = extra[entry];
        }

        const params = {
            'cmd': 'captcha',
            'payload': payload,
            'files': files
        };

        this._call(params, cb);
    };

}


module.exports = HttpClient;