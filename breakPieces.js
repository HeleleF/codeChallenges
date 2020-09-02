/**
 * Breaks the diagram in the minimal pieces it is made of.
 * @param {string} shape ASCII diagram , comprised of minus signs -, plus signs +, vertical bars | and whitespaces. 
 * @returns {string[]}
 */
const breakPieces = shape => {

    const grid = shape.split('\n').map(line => line.split(''));
    const height = grid.length;
    const width = grid[0].length;

    const trace = (x, y) => {

        const piece = [];
        piece.push(`${x}x${y}`);

        let cx = x, 
            cy = y;

        if (cy < width - 1) {
            cy++;
        } else {
            return null;
        }
        if (cx >= height - 1) return null;

        do {

            while (!(grid[cx][cy] === '+' && grid[cx + 1][cy] !== ' ')) {
                cy++;
            }
            if (!piece.includes(`${cx}x${cy}`)) {
                piece.push(`${cx}x${cy}`);
                console.log(`Found + at ${cx}x${cy}, going down now`);
                cx++;
            } else {
                console.log(`Found existing + at ${cx}x${cy}, break`);
                break;
            }

            while (!(grid[cx][cy] === '+' && grid[cx][cy - 1] !== ' ')) {
                cx++;
            }
            if (!piece.includes(`${cx}x${cy}`)) {
                piece.push(`${cx}x${cy}`);
                console.log(`Found + at ${cx}x${cy}, going left now`);
                cy--;
            } else {
                console.log(`Found existing + at ${cx}x${cy}, break`);
                break;
            }

            while (!(grid[cx][cy] === '+' && grid[cx - 1][cy] !== ' ')) {
                cy--;
            }
            if (!piece.includes(`${cx}x${cy}`)) {
                piece.push(`${cx}x${cy}`);
                console.log(`Found + at ${cx}x${cy}, going up now`);
                cx--;

            } else {
                console.log(`Found existing + at ${cx}x${cy}, break`);
                break;
            }

            while (!(grid[cx][cy] === '+' && grid[cx][cy + 1] !== ' ')) {
                cx--;
            }
            if (!piece.includes(`${cx}x${cy}`)) {
                piece.push(`${cx}x${cy}`);
                console.log(`Found + at ${cx}x${cy}, going right now`);
            } else {
                console.log(`Found existing + at ${cx}x${cy}, break`);
                break;
            }

        } while (cx !== x && cy !== y);

        console.log('done', piece);
        return piece.sort().join(',');
    };

    const pieces = [];

    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
            const char = grid[h][w];

            if (char === '+') {
                const newPiece = trace(h, w);
                if (newPiece && !pieces.includes(newPiece)) pieces.push(newPiece);
            }
        }
    }

    return pieces.map(p => {

        const c = p.split(',').map(e => e.split('x').map(Number));

        const hMin = Math.min(...c.map(d => d[0]));
        const hMax = Math.max(...c.map(d => d[0]));

        const wMin = Math.min(...c.map(d => d[1]));
        const wMax = Math.max(...c.map(d => d[1]));

        let result = `+${'-'.repeat(wMax - wMin - 1)}+\n`;

        for (let i = 0; i < hMax - hMin - 1; i++) {
        result += `|${' '.repeat(wMax - wMin - 1)}|\n`;
        }
        result += `+${'-'.repeat(wMax - wMin - 1)}+`;

        return result;
    });
};

breakPieces([
  "+------------+",
  "|            |",
  "|            |",
  "|            |",
  "+------+-----+",
  "|      |     |",
  "|      |     |",
  "+------+-----+"].join("\n"))