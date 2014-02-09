var crypto        = require('crypto');

var utils = {
    createHash: function(secret){
        var cipher = crypto.createCipher('blowfish', secret);
        return(cipher.final('hex'));   
    }
}
module.exports = utils;

