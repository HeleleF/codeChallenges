
const findNb = m => {

    // https://en.wikipedia.org/wiki/Faulhaber%27s_formula#Examples
    const prod = 2 * Math.sqrt(m);

    // Math.sqrt(n^2 + n) is roughly n + 0.5
    const approx = Math.floor(Math.sqrt(prod));

    // check if approximation is correct
    const orig = approx * (approx + 1);

    return orig === prod ? approx : -1;
}



const findUniq = arr => {

    const sorted = arr.sort();
    return sorted[0] === sorted[1] ? sorted.pop() : sorted[0];
}



const snail = square => {

    const N = square.length;
    const sorted = [];

    // nothing to do
    if (N === 1) return square[0];

    for (let border = 0; border <= Math.floor(N / 2); border++) {

        // 1. top left to top right
        const firstRow = border > 0 ? square[border].slice(border, -border) : square[border]; // slice(0,-0) returns empty
        sorted.push(...firstRow);

        if (firstRow.length < 2) break;

        // 2. top right to bottom right
        for (let row = 1 + border; row <= N - 2 - border; row++) {
            const lastColumn = square[row][N - 1 - border];
            sorted.push(lastColumn);
        }

        // 3. bottom right to bottom left
        const lastRow = border > 0 ? square[N - 1 - border].slice(border, -border) : square[N - 1 - border];
        sorted.push(...lastRow.reverse());

        // 4. bottom left to top left
        for (let row = N - 2 - border; row >= 1 + border; row--) {
            const firstColumn = square[row][border];
            sorted.push(firstColumn);
        }
    }
    return sorted;
}


for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        for (let k = 0; k < 10; k++) {
            for (let l = 0; l < 10; l++) {
                for (let m = 0; m < 10; m++) {
                    if (md5(`${i}${j}${k}${l}${m}`) === hash) return `${i}${j}${k}${l}${m}`;
                }
            }
        }
    }
}

const encrypt = (text, n) => {

    if (!text || n < 1) return text;

    let result = text;

    for (let i = 0; i < n; i++) {
        const { f, l } = [...result].reduce((acc, cur, idx) => {
            if (idx % 2) {
                acc.f += cur;
            } else {
                acc.l += cur;
            }
            return acc;
        }, { f: '', l: '' });
        result = `${f}${l}`;
    }

    return result;
}

const decrypt = (encryptedText, n) => {

    if (!encryptedText || n < 1) return encryptedText;

    const L = Math.floor(encryptedText.length / 2);

    let result = encryptedText;

    for (let i = 0; i < n; i++) {
        result = [...result.slice(L)].map((cur, idx) => idx < L ? cur + result[idx] : cur).join('');
    }
    return result;
}



const encryptThis = text => {

    return text
        .split(' ')
        .map(word => {
            const L = word.length;
            return `${word.charCodeAt(0)}${L > 2 ? word[L - 1] : ''}${L > 2 ? word.slice(2, L - 1) : ''}${L > 1 ? word[1] : ''}`
        })
        .join(' ');
}

const loop_size = node => {

    let t = node;
    let cnt = 0;

    const hash = new WeakMap();

    while (true) {

        if (!hash.has(t)) {
            hash.set(t, cnt);
        } else {
            return cnt - hash.get(t);
        }

        t = t.getNext();
        cnt++;

    }
}

const isInteresting = (n, arr) => {

    if (n < 98) return 0;

    let i, interesting = false;

    for (i = 0; i < 3; i++) {

        const str = (n + i).toString();
        if (str.length < 3) continue;

        const digits = [...str].map(Number);

        if (/^[1-9](0+)$/.test(str)) { interesting = true; break; }

        const [_, ...diffs] = digits.map((d, idx) => d - digits[idx - 1]);
        if (diffs.every(diff => diff === -1)) { interesting = true; break; }
        if (diffs.slice(0, -1).every(diff => diff === 1) && [1, -9].includes(diffs[diffs.length - 1])) { interesting = true; break; }

        const palindrome = str.split('').reverse().join('');
        if (str === palindrome) { interesting = true; break; }

        if (arr.includes(n + i)) { interesting = true; break; }
    }

    return interesting ? i === 0 ? 2 : 1 : 0;
}

const dirReduc = arr => {

    let dirs = arr.join(','), last = '';

    do {
        last = dirs;
        dirs = dirs.replace(/^,|NORTH,SOUTH|SOUTH,NORTH|EAST,WEST|WEST,EAST|,$/g, '').replace(/,,+/g, ',');
        console.log('simplified to', dirs);
    } while (dirs !== last)

    return dirs.length ? dirs.split(',') : [];
}


const longestSlideDown = pyramid => {

    const tmp = [...pyramid];

    while (tmp.length > 1) {
        const step = tmp.length - 2;

        tmp[step] = tmp[step].map((n, idx) => n + Math.max(tmp[step + 1][idx], tmp[step + 1][idx + 1]));
        tmp.pop()
    }
    return tmp[0][0];
}

Array.prototype.sameStructureAs = function (other) {

    if (!isArray(other)) return false;

    const a = JSON.stringify(this).replace(/[0-9\.]/g, '');
    const b = JSON.stringify(other).replace(/[0-9\.]/g, '');

    return a === b;
};

const solution = n => Array.from({ length: n }, (_, i) => i).reduce((acc, v) => (v % 3 === 0 || v % 5 === 0) ? acc += v : acc, 0);

const findTheNumberPlate = n => {
    const digits = n % 999 + 1;

    let rest = Math.floor(n / 999);

    const firstLetter = rest % 26; // A -> 0, B -> 1 ... Z -> 25
    rest = Math.floor(rest / 26);

    const secondLetter = rest % 26; // A -> 0, B -> 1 ... Z -> 25
    rest = Math.floor(rest / 26);

    const thirdLetter = rest % 26;

    return `${String.fromCharCode(97 + firstLetter, 97 + secondLetter, 97 + thirdLetter)}${digits.toString().padStart(3, '0')}`;
}

const v2 = parens => {

    let tmp = '';

    do {

        tmp = parens;
        parens = parens.replace(/\(\)/g, '');

    } while (tmp !== parens && parens.length > 1)

    return parens.length === 0;
}

/**
 * @param {number[]} arr 
 */
const maxSequence = arr => {

    if (!arr.length || arr.every(n => n < 0)) return 0;

    return arr.reduce((acc, cur) => {

        acc[1] += cur;

        if (acc[1] < 0) {

            acc[1] = 0;

        } else if (acc[0] < acc[1]) {

            acc[0] = acc[1];
        }
        return acc;

    }, [0, 0])[0];
}

const RomanNumerals = {

    SYMBOLS: [
        ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
        ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
        ['C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
        ['M', 'MM', 'MMM']
    ],
    toRoman(num) {

        return this.SYMBOLS.reduceRight((acc, cur, idx) => {

            const div = 10 ** idx;

            const v = Math.floor(num / div);
            num = num % div;

            return v > 0 ? acc + cur[v - 1] : acc;

        }, '');
    },
    fromRoman(str) {

        return this.SYMBOLS.reduce((acc, cur, idx) => {

            const regex = new RegExp(`(${cur.join('|')})$`);

            str = str.replace(regex, digit => {
                const value = cur.findIndex(n => n === digit) + 1;
                acc += value * 10 ** idx;
                return '';
            });
            return acc;

        }, 0);

    }
}

const solution = list => {

    // Node 8 :(
    String.prototype.matchAll = function (regex) {

        const str = this;

        return {
            *[Symbol.iterator]() {

                let matchResult;

                while ((matchResult = regex.exec(str)) !== null) {
                    yield matchResult;
                }
            }
        }
    };

    const seriesIndices = Array.from(list
        .map((num, idx, arr) => num - arr[idx - 1])
        .slice(1)
        .join('')
        .matchAll(/(111*)/g),
        match => ({ start: match.index, end: match.index + match[0].length + 1 }))

    // no ranges found
    if (!seriesIndices.length) return list.join(',');

    return seriesIndices
        .map(({ start, end }, idx, arr) => {

            let ret = '';

            if (idx === 0 && start > 0) {
                ret += `${list.slice(0, start).join(',')}${idx <= arr.length - 1 ? ',' : ''}`;
            }

            if (idx > 0 && start > arr[idx - 1].end) {
                ret += `${list.slice(arr[idx - 1].end, start).join(',')},`;
            }

            const series = list.slice(start, end);
            ret += `${series.shift()}-${series.pop()}${idx < arr.length - 1 ? ',' : ''}`;

            if (idx === arr.length - 1 && end < list.length) {
                ret += `,${list.slice(end, list.length).join(',')}`;
            }

            return ret;
        })
        .join('');
}

const pigIt = str => str.replace(/\b(\w)(\w*)\b/g, '$2$1ay');

const validateBattlefield = field => {

    const ships = {
        destroyer: 0,
        battleship: 0,
        cruiser: 0,
        submarine: 0
    };

    const getNeighbors = (x, y) => {

        let cells = [];

        if (x > 0) {
            cells.push(field[x - 1][y - 1] || 0, field[x - 1][y], field[x - 1][y + 1] || 0)
        } else {
            cells.push(0, 0, 0);
        }

        cells.push(field[x][y - 1] || 0, field[x][y + 1] || 0);

        if (x < 9) {
            cells.push(field[x + 1][y - 1] || 0, field[x + 1][y], field[x + 1][y + 1] || 0)
        } else {
            cells.push(0, 0, 0);
        }

        return cells;
    }

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {

            const cell = field[x][y];
            if (cell !== 1) continue;

            const neighbors = getNeighbors(x, y);

            // submarine
            if (neighbors.every(c => c === 0)) {

                if (ships.submarine === 4) {
                    return false
                } else {
                    ships.submarine += 1;
                    field[x][y] = 'S';
                    continue;
                }

            }

            // contact with other ships
            if (neighbors.some(c => !Number.isInteger(c))) {
                return false;
            }

            const nearby = neighbors.reduce((i, j) => i + j, 0);

            // overlap
            if (nearby > 2) {
                return false;
            }

            const idx = neighbors.findIndex(c => c === 1);

            if ([0, 2, 5, 7].includes(idx)) return false;

            if (nearby === 2) {

                switch (idx) {
                    case 1:
                    case 6:
                        if (neighbors[1] !== neighbors[6]) return false;

                        const down = x < 8 ? field[x + 2][y] : 0;

                        if (down === 0) {
                            if (ships.cruiser === 2) {
                                return false
                            } else {
                                ships.cruiser += 1;
                                field[x - 1][y] = 'C';
                                field[x][y] = 'C';
                                field[x + 1][y] = 'C';
                                continue;
                            }
                        } else if (down === 1) {

                            if (ships.battleship === 1) {
                                return false
                            } else {
                                ships.battleship += 1;
                                field[x - 1][y] = 'B';
                                field[x][y] = 'B';
                                field[x + 1][y] = 'B';
                                field[x + 2][y] = 'B';
                                continue;
                            }

                        } else {
                            return false;
                        }

                    case 3:
                    case 4:
                        if (neighbors[3] !== neighbors[4]) return false;

                        const right = field[x][y + 2] || 0;

                        if (right === 0) {
                            if (ships.cruiser === 2) {
                                return false
                            } else {
                                ships.cruiser += 1;
                                field[x][y - 1] = 'C';
                                field[x][y] = 'C';
                                field[x][y + 1] = 'C';
                                continue;
                            }
                        } else if (right === 1) {

                            if (ships.battleship === 1) {
                                return false
                            } else {
                                ships.battleship += 1;
                                field[x][y - 1] = 'B';
                                field[x][y] = 'B';
                                field[x][y + 1] = 'B';
                                field[x][y + 2] = 'B';
                                continue;
                            }

                        } else {
                            return false;
                        }

                    default:
                        return false;
                }

            } else if (nearby === 1) {

                switch (idx) {

                    case 4:
                        const right1 = field[x][y + 2] || 0;
                        const right2 = field[x][y + 3] || 0;

                        if (right1 === 0) {
                            if (ships.destroyer === 3) {
                                return false
                            } else {
                                ships.destroyer += 1;
                                field[x][y] = 'D';
                                field[x][y + 1] = 'D';
                                continue;
                            }

                        } else if (right1 === 1 && right2 === 0) {
                            if (ships.cruiser === 2) {
                                return false
                            } else {
                                ships.cruiser += 1;
                                field[x][y] = 'C';
                                field[x][y + 1] = 'C';
                                field[x][y + 2] = 'C';
                                continue;
                            }
                        } else if (right1 === 1 && right2 === 1) {
                            if (ships.battleship === 1) {
                                return false
                            } else {
                                ships.battleship += 1;
                                field[x][y] = 'B';
                                field[x][y + 1] = 'B';
                                field[x][y + 2] = 'B';
                                field[x][y + 3] = 'B';
                                continue;
                            }
                        } else {
                            return false;
                        }

                    case 6:
                        const down1 = x < 8 ? field[x + 2][y] : 0;
                        const down2 = x < 7 ? field[x + 3][y] : 0;

                        if (down1 === 0) {
                            if (ships.destroyer === 3) {
                                return false
                            } else {
                                ships.destroyer += 1;
                                field[x][y] = 'D';
                                field[x + 1][y] = 'D';
                                continue;
                            }

                        } else if (down1 === 1 && down2 === 0) {
                            if (ships.cruiser === 2) {
                                return false
                            } else {
                                ships.cruiser += 1;
                                field[x][y] = 'C';
                                field[x + 1][y] = 'C';
                                field[x + 2][y] = 'C';
                                continue;
                            }
                        } else if (down1 === 1 && down2 === 1) {
                            if (ships.battleship === 1) {
                                return false
                            } else {
                                ships.battleship += 1;
                                field[x][y] = 'B';
                                field[x + 1][y] = 'B';
                                field[x + 2][y] = 'B';
                                field[x + 3][y] = 'B';
                                continue;
                            }
                        } else {
                            return false;
                        }
                    default:
                        return false;
                }

            } else {
                return false;
            }
        }
    }
    return ships.battleship === 1
        && ships.cruiser === 2
        && ships.destroyer === 3
        && ships.submarine === 4;
}


class VigenèreCipher {
    constructor(key, abc) {
        this.key = key;
        this.abc = abc;
        this.K = key.length;
        this.L = abc.length;
    }

    idx(c) {
        return this.abc.indexOf(c);
    }

    shiftRight(a, i) {

        const sum = this.idx(a) + this.idx(this.key[i % this.K]);

        return this.abc[sum % this.L];
    }

    shiftLeft(a, i) {

        const diff = this.idx(a) - this.idx(this.key[i % this.K]);

        // stay positive X % M === (X + M) % M
        return this.abc[(diff < 0 ? diff + this.L : diff) % this.L];
    }

    shift(char, i, forward) {
        if (!this.abc.includes(char)) return char;

        return forward ? this.shiftRight(char, i) : this.shiftLeft(char, i);
    }

    encode(str, forward = true) {
        return [...str]
            .map((char, idx) => this.shift(char, idx, forward))
            .join('');
    }

    decode(str) {
        return this.encode(str, false);
    }
}

const sum_pairs = (ints, sum) => {

    const NF = {};

    let s, e = ints.length - 1;

    for (let i = 0; i < e; i++) {

        const rest = sum - ints[i];
        const end = NF[rest] ? -1 : ints.findIndex((n, idx) => n === rest && idx > i);

        if (end > -1) {

            if (end <= e) {
                s = i;
                e = end;
            }
        } else {
            NF[rest] = true;
        }

    }
    return s === undefined ? s : [ints[s], ints[e]];
}

/**
 * @param {number} money 
 * @param {number[]} coins 
 */
const countChange = (money, coins) => {
    // your implementation here

    const nums = coins.map(coin => money / coin | 0);
}


const persistence = (num, count = 0) => num < 10 ? count : persistence([...num.toString()].reduce((x, y) => x * y, 1), count + 1);


const likes = names => {

    const [first, second, third, ...rest] = names;

    if (rest.length) return `${first}, ${second} and ${rest.length + 1} others like this`;
    if (third) return `${first}, ${second} and ${third} like this`;

    return `${names.length ? names.join(' and ') : 'no one'} like${names.length < 2 ? 's' : ''} this`;
}

const isValidWalk = walk => {

    const counts = walk.reduce((acc, cur) => {

        if (acc[cur]) acc[cur] += 1;
        else acc[cur] = 1;

        return acc;
    }, {});

    return walk.length === 10 && count.n === count.s && count.e === count.w;
}

const duplicateCount = text => {

    const seen = {};
    return [...text].reduce((acc, cur) => {
        const c = cur.toLowerCase();
        if (seen[c]) {

            seen[c] += 1;
            return seen[c] === 2 ? acc + 1 : acc;

        } else {
            seen[c] = 1;
            return acc;
        };

    }, 0);
}

const tribonacci = (signature, n) => Array.from({ length: n }).map((_, i, arr) => {
    const r = i > 2 ? arr[i - 1] + arr[i - 2] + arr[i - 3] : signature[i];
    arr[i] = r;
    return r;
});


const nextBigger = N => {

    // store all digits in LEFT
    const LEFT = Array.from(N.toString(), Number), RIGHT = [];

    while (LEFT.length > 1) {

        // compare last two digits
        const cur = LEFT.pop();
        const prev = LEFT[LEFT.length - 1];

        // move current value to RIGHT
        RIGHT.unshift(cur);

        // since we're going from right to left, this will find the smallest
        // opportunity to increase the number
        if (prev < cur) {

            // find the smallest digit bigger than prev...
            const S = [...RIGHT].sort((x, y) => x - y).find(x => x > prev);
            
            // ... and remove it from RIGHT
            RIGHT.splice(RIGHT.indexOf(S), 1);

            // move prev from LEFT to RIGHT
            RIGHT.unshift(LEFT.pop());

            // the result is now higher than the input
            LEFT.push(S);
    
            // make the smallest number possible by sorting ascending
            RIGHT.sort((x, y) => x - y);

            // combine both halfs and return the actual number
            const R = LEFT.concat(RIGHT);
            return Number(R.join(''));
        }     
    }
    return -1;
}
