

const crypto = require('crypto');
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const passwordCracker = hash => {

    if (hash === crypto.createHash('sha1').update('').digest('hex')) return '';

    for (const char1 of alphabet) {
        if (hash === crypto.createHash('sha1').update(char1).digest('hex')) return char1;   
    }

    for (const char1 of alphabet) {
        for (const char2 of alphabet) {        
            if (hash === crypto.createHash('sha1').update(`${char1}${char2}`).digest('hex')) return `${char1}${char2}`;       
        }
    }

    for (const char1 of alphabet) {
        for (const char2 of alphabet) {
            for (const char3 of alphabet) {
                if (hash === crypto.createHash('sha1').update(`${char1}${char2}${char3}`).digest('hex')) return `${char1}${char2}${char3}`;
            }
        }
    }

    for (const char1 of alphabet) {
        for (const char2 of alphabet) {
            for (const char3 of alphabet) {
                for (const char4 of alphabet) {
                    if (hash === crypto.createHash('sha1').update(`${char1}${char2}${char3}${char4}`).digest('hex')) return `${char1}${char2}${char3}${char4}`;
                }
            }
        }
    }

    for (const char1 of alphabet) {
        for (const char2 of alphabet) {
            for (const char3 of alphabet) {
                for (const char4 of alphabet) {
                    for (const char5 of alphabet) {
                        if (hash === crypto.createHash('sha1').update(`${char1}${char2}${char3}${char4}${char5}`).digest('hex')) return `${char1}${char2}${char3}${char4}${char5}`;
                    }
                }
            }
        }
    }
}
