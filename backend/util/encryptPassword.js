const bcrypt = require('bcrypt');

async function encryptPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

module.exports = encryptPassword;