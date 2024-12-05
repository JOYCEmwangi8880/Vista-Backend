const crypto = require ('crypto');

const generation = () => {
    return crypto.randomInt(100000, 999999).toString();

};

module.export = generateOtp;