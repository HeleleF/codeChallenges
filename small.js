function findOutlier(integers) {
    const r = integers.map(i => Math.abs(i % 2)).reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
    }, {});

    return r['0'] > r['1'] ? integers.find(i => Math.abs(i % 2) === 1) : integers.find(i => Math.abs(i % 2) === 0);
}

var countBits = function (n) {
    return [...n.toString(2)].filter(b => b === '1').length;
};

const spinWords = str => str.replace(/\w{5,}/g, r => [...r].reverse().join(''));


const arrayDiff = (a, b) => {

    for (const n of b) {
        a = a.filter(e => e !== n);
    }
    return a;
};

const order = words => words.split(' ').sort((a, b) => +a.replace(/\D*/g, '') - +b.replace(/\D*/g, '')).join(' ');

const toCamelCase = str => str.replace(/((_|-)\w)/g, w => w.slice(1).toUpperCase());

const alphabetPosition = text => [...text].map(c => {const r = c.toLowerCase().charCodeAt(0) - 96; return r < 1 || r > 26 ? -1 : r}).filter(n => n !== -1).join(' ');

const orderWeight = str => {
    const weight = x => Array.from(x, Number).reduce((acc, cur) => acc + cur, 0);
    return (str.match(/\d+/g) || []).sort((x, y) => { const c = weight(x) - weight(y); return c !== 0 ? c : `${x}`.localeCompare(`${y}`) }).join(' ');
};

const rgb = (r, g, b) => {
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    return `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
};

const scramble = (s1, s2) => {
    if (s1.length < s2.length) return false;

    const H = {};

    for (let i = 0; i < s2.length; i++) {

        const c = s2[i];
        const idx = s1.indexOf(c, H[c] || 0);

        if (idx !== -1) {
            H[c] = idx + 1;
        } else {
            return false;
        }
    }
    return true;
}

const incrementString = str => /(^|\D)$/.test(str) ? `${str}1` : str.replace(/\d+$/, d => `${(Number(d) + 1)}`.padStart(d.length, '0'));

const rot13 = str => {
    return str.match(/.{1}/g).map(c => {
        const cc = c.charCodeAt(0);
        if (cc >= 97 && cc <= 122) {
            return String.fromCharCode((((cc - 97) + 13) % 26) + 97);
        } else if (cc >= 65 && cc <= 90) {
            return String.fromCharCode((((cc - 65) + 13) % 26) + 65);
        } else {
            return c;
        }     
    }).join('');
};

const anagrams = (w, ws) => {
    const word = [...w].sort().join('');
    return ws.filter(c => word === [...c].sort().join(''))
};

const domainName = url => {
    return url.replace(/(https?:\/\/)?(www\.)?/, '').replace(/\..*$/, '');
};

const iqTest = numbers => {

    numbers = numbers.split(' ').map(Number);

    const even = numbers.filter(n => n % 2 === 0);
    const odd = numbers.filter(n => n % 2 === 1);

    return even.length > odd.length ? 1 + numbers.findIndex(n => n % 2 === 1) : 1 + numbers.findIndex(n => n % 2 === 0);
};

const uniqueInOrder = i => (Array.isArray(i) ? i.join('') : i).replace(/(\w)\1+/g, r => r[0]).split('').map(c => Number.isInteger(+c) ? +c : c);

const longestConsec = (a, k) => {
    const n = a.length;
    if (n === 0 || k > n || k <= 0) return '';

    return a.reduce((acc, _, idx) => {
        const consec = a.slice(idx, idx + k).join('');
        if (consec.length > acc.length) acc = consec;
        return acc;
    }, '');
}

const sortArray = a => {
    const oddSorted = a.filter(n => n % 2 === 1).sort((x, y) => x - y);
    return a.map(n => n % 2 === 1 ? oddSorted.shift() : n);
};

const countSmileys = a => (a.join('').match(/(\:|\;)(\-|\~)?(\)|D)/g) || []).length;

const solution = str => str.padEnd(str.length % 2 ? str.length + 1 : 0, '_').match(/.{2}/g) || [];

const list = names => {

    const [first, second, ...rest] = names;

    if (!first) return '';
    if (!second) return first.name;
    if (!rest.length) return `${first.name} & ${second.name}`;

    return `${names.slice(0, -1).map(n => n.name).join(', ')} & ${rest.pop().name}`;

};

const getCount = str => (str.match(/[aeiou]/g) || []).length

const comp = (a, b) => {
    if (!a || !b) return false;
    b.sort((x, y) => x - y);
    return a.sort((x, y) => x - y).every((n, i) => n * n === b[i]);
};

const findMissingLetter = a => {
    for (let i = 0; i < a.length; i++) {
        if (a[i + 1].charCodeAt(0) - a[i].charCodeAt(0) !== 1) return String.fromCharCode(a[i].charCodeAt(0) + 1);
    }
};

const add = (a) => {
    return (b) => {
        return a + b;
    };
}

const wave = str => {
    let x = 0;
    return Array.from({ length: str.replace(/ /g, '').length }, (_, i) => {

        let char = str[i + x];

        while (char === ' ') {
            char = str[i + ++x];
        }
        
        return `${str.slice(0, i + x)}${char.toUpperCase()}${str.slice(i + x + 1)}`;   
    });
};

const createPhoneNumber = nums => `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`.replace(/,/g, '');