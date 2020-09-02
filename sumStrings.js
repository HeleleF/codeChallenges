/**
 * Given the string representations of two integers, 
 * returns the string representation of the sum of those integers.
 * @param {string} a 
 * @param {string} b 
 */
const sumStrings = (a, b) => {

    let carry = 0;

    a = a.replace(/^0(0*)/, '');
    b = b.replace(/^0(0*)/, '');

    if (a.length > b.length) {
        b = b.padStart(a.length, '0');
    } else {
        a = a.padStart(b.length, '0');
    }
    return [...a].reduceRight((result, digit, idx) => {

        let add = Number(digit) + Number(b[idx]);
        
        if (carry === 1) {
            add++;
            carry = 0;
        }

        if (add > 9) {
            add %= 10;
            carry = 1;
        }
        return `${idx === 0 && carry === 1 ? carry : ''}${add}${result}`;
    }, '');
};