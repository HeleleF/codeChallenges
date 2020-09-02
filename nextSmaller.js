/**
 * 
 * @param {number} N 
 */
const nextSmaller = N => {

    // store all digits in LEFT
    const LEFT = Array.from(N.toString(), Number), RIGHT = [];

    while (LEFT.length > 1) {

        // compare last two digits
        const cur = LEFT.pop();
        const prev = LEFT[LEFT.length - 1];

        // move current value to RIGHT
        RIGHT.unshift(cur);

        // since we're going from right to left, this will find the smallest
        // opportunity to decrease the number
        if (prev > cur) {

            // find the biggest digit smaller than prev...
            const S = [...RIGHT].sort((x, y) => y - x).find(x => x < prev);
            
            // ... and remove it from RIGHT
            RIGHT.splice(RIGHT.indexOf(S), 1);

            // move prev from LEFT to RIGHT
            RIGHT.unshift(LEFT.pop());

            // the result is now higher than the input
            LEFT.push(S);
    
            // make the biggest number possible by sorting descending
            RIGHT.sort((x, y) => y - x);

            // combine both halfs and return the actual number
            const R = LEFT.concat(RIGHT);

            // dont allow cases where the biggest smaller number would have zeros in front
            return R[0] !== 0 ? Number(R.join('')) : -1;
        }     
    }
    return -1;
}