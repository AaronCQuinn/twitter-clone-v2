const crypto = require('crypto-js');

function encryptPassword(password) {
    const salt = crypto.lib.WordArray.random(16);
    const hash = crypto.PBKDF2(password, salt, {keySize: 8, interations: 1000});

    return salt.toString() + ":" + hash.toString();
}

export default encryptPassword;