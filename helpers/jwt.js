const jwt = require('jsonwebtoken');
const key = require('../lib/key')
// use 'utf8' to get string instead of byte array  (512 bit key)
// use 'utf8' to get string instead of byte array
// const privateKEY = fs.readFileSync('./../private.key', 'utf8'); // to sign JWT
// const publicKEY = fs.readFileSync('./../public.key', 'utf8'); 	// to verify JWT

//console.log(fs.readFileSync('./../private.key', 'utf8'))
const privateKEY = ''
const publicKEY = ''


console.log("getPrivate", key.private(), key.public())

module.exports = {
    sign: (payload, $Option) => {
        let i  = 'Mogola sangare';          // Issuer
        let s  = $Option.email;        // Subject
        let a  = $Option.password; // Audience

        // Token signing options
        let verifyOptions = {
                issuer:  i,
                subject:  s,
                audience:  a,
                expiresIn:  "12h"
            }
        return jwt.sign(payload,  key.private(), verifyOptions);
    },

    verify: (token, $Option) => {
        let i  = 'Mogola sangare';          // Issuer
        let s  = $Option.email;        // Subject
        let a  = $Option.password; // Audience

        // Token signing options
        let verifyOptions = {
            issuer:  i,
            subject:  s,
            audience:  a,
            expiresIn:  "12h"
        }
        try{
            return jwt.verify(token, key.public());
        }catch (err){
            return false;
        }
    },

    decode: (token) => {
        return jwt.decode(token, {complete: true});
        //returns null if token is invalid
    }
}