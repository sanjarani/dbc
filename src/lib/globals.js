const fs = require('node:fs');

/**
 *
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
    const a = Math.ceil(min);
    const b = Math.floor(max);
    return Math.floor(Math.random() * (b - a + 1)) + a;
}


/**
 *
 * @param image
 * @returns {*|string}
 */
function load_image(image) {
    const image_regex = RegExp('\.jpg$|\.png$|\.gif$|\.bmp$');
    const b64_regex = RegExp('^base64:');
    if (image_regex.test(image)) {
        return fs.readFileSync(image, {'encoding': 'base64'});
    } else if (b64_regex.test(image)) {
        return image.substring(7);
    } else {
        return image.toString('base64');
    }
}


module.exports = {
    load_image: load_image,
    getRandomInt: getRandomInt
};
