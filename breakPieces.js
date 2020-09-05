/**
 * Which direction we are currently following
 * 
 * Used for tracing the pieces
 */
const D = Object.freeze({
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
});

/**
 * Every point on the grid is one of:
 *  - `+` means Corner
 *  - `-` and `|` are Lines
 *  - ` ` is Foreground (Inside of pieces) 
 *  - `B` is Background (Outside of pieces)
 * @typedef {'+' | '-' | '|' | 'B' | ' '} GridValue
 */

/**
 * Breaks the diagram in the minimal pieces it is made of.
 * @param {string} shape ASCII diagram , comprised of minus signs -, plus signs +, vertical bars | and whitespaces. 
 * @returns {string[]}
 */
const breakPieces = shape => {

    // create a 2d grid and set "background" whitespace to 'B' to be able to recognize it
    const grid = shape.split('\n').map(line => line.replace(/(?<=^ *) | (?= *$)/g, 'B').split(''));
    const height = grid.length;
    const width = grid[0].length;

    /**
     * Stores each piece as Array of Points
     * @type {Point[][]}
     */
    const pieces = [];

    /**
     * Stores all corners (+)
     * @type {Point[]}
     */
    const allCorners = [];

    /**
     * Helper class for points
     * on the grid
     */
    class Point {
        /**
         * Creates a new point
         * @param {number} x 
         * @param {number} y 
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;

            /**
             * Grid value at this point
             * @type {GridValue}
             */
            this.value = Point.val(x, y);

            this.partOf = this._getPartOfCount();
        }

        /**
         * Helper method to calculate how many pieces
         * this corner is part of.
         * @private
         */
        _getPartOfCount() {

            // 8-neighborhood around
            const n = [
                Point.val(this.x - 1, this.y - 1),
                Point.val(this.x - 1, this.y),
                Point.val(this.x - 1, this.y + 1),
                Point.val(this.x, this.y - 1),
                Point.val(this.x, this.y + 1),
                Point.val(this.x + 1, this.y - 1),
                Point.val(this.x + 1, this.y),
                Point.val(this.x + 1, this.y + 1),
            ];

            const edges = n.filter(p => p === '-' || p === '|').length;
            const ind = [];
            for (let i = 0; i < 8; i++) {
                if (n[i] === '-' || n[i] === '|') ind.push(i);
            }

            switch (edges) {

                case 2:
                    switch (ind[0]) {
                        case 1: 
                            return ind[1] === 3 ? (n[0] === n[7] ? 2 : 1) : (n[2] === n[5] ? 2 : 1);
                        case 3: 
                            return n[2] === n[5] ? 2 : 1;
                        case 4: 
                            return n[0] === n[7] ? 2 : 1;
                    }

                case 3: 
                    return n.filter(p => p === ' ').length === 5 ? 3 : 2;

                case 4:
                    return n.filter(p => p === ' ').length;
            }
        }

        /**
         * Mark this point as 'used' once by decrementing
         * its `partOf` counter.
         */
        use() {
            if (this.partOf === 0) {
                throw new RangeError(`${this} can't be used anymore!`);
            }
            this.partOf--;
            return this;
        }

        /**
         * Helper to get the grid value
         * for a given position
         * @param {number} x 
         * @param {number} y 
         * @returns {GridValue}
         */
        static val(x, y) {
            try {
                return grid[x][y] || 'B';
            } catch (_) {
                return 'B';
            }     
        }

        /**
         * Helper method to return the smallest 
         * bounding box for a given list of `Point`s
         * @param {Point[]} pointList 
         */
        static boundingBox(pointList) {
            const sortedX = [...pointList].sort((p1, p2) => p1.x - p2.x);
            const sortedY = [...pointList].sort((p1, p2) => p1.y - p2.y);

            return {
                minX: sortedX[0].x,
                maxX: sortedX.pop().x,
                minY: sortedY[0].y,
                maxY: sortedY.pop().y,
            }
        }

        copy() {
            return new Point(this.x, this.y);
        }
    
        /**
         * Move point north `cnt` steps.
         * Default is 1
         * 
         * **This creates a new point!**
         * @param {number=} cnt 
         */
        north(cnt = 1) {
            return new Point(this.x - cnt, this.y);
        }

        /**
         * Move point west `cnt` steps.
         * Default is 1
         * 
         * **This creates a new point!**
         * @param {number=} cnt 
         */
        west(cnt = 1) {
            return new Point(this.x, this.y - cnt);
        }
    
        /**
         * Move point east `cnt` steps.
         * Default is 1
         * 
         * **This creates a new point!**
         * @param {number=} cnt 
         */
        east(cnt = 1) {
            return new Point(this.x, this.y + cnt);
        }
    
        /**
         * Move point south `cnt` steps.
         * Default is 1
         * 
         * **This creates a new point!**
         * @param {number=} cnt 
         */
        south(cnt = 1) {
            return new Point(this.x + cnt, this.y);
        }
    
        /**
         * Checks if `this` point is equal to either:
         *  - another point `x2` or
         *  - coordinates `(x2,y2)`
         * @param {Point | number} x2 
         * @param {number} y2 
         */
        equals(x2, y2) {
            return x2 instanceof Point 
                ? this.x === x2.x && this.y === x2.y 
                : this.x === x2 && this.y === y2;
        }
    
        toString() {
            return `P(${this.x},${this.y})`;
        }
    }

    /**
     * Finds a piece on the grid for the given
     * corner point.
     * 
     *  1. Walk right
     *  2. If corner, turn right
     *  3. If we cant walk right, turn left until we find the line again
     * 
     * This way, we always find the smallest possible piece
     * @param {number} x 
     * @param {number} y 
     */
    const findPiece = (x, y) => {

        const start = new Point(x, y);

        // store all corners we visit
        const corners = [];

        // start by walking east
        let orientation = D.EAST;

        let cur = start.copy();
        let next;

        // repeat until we reach the start
        do {
            // go one step in the current direction
            switch (orientation) {

                case D.NORTH:
                    next = cur.north();
                    break;

                case D.EAST: 
                    next = cur.east();
                    break;

                case D.SOUTH: 
                    next = cur.south();
                    break;

                case D.WEST: 
                    next = cur.west();
                    break;
            }

            // not on the line anymore, go left and try again
            if (next.value === 'B') {

                if (orientation === D.EAST) break;
                orientation--;

            } else if (next.value === ' ') {
                orientation--;
            } else {

                // keep walking on the line
                cur = next;

                // corner found, store it
                // and turn right
                if (cur.value === '+') {
                    corners.push(cur.copy());
                    orientation++;
                }
            }

            // orientation has to "stay in its bounds"
            if (orientation < D.NORTH) orientation = D.WEST;
            else if (orientation > D.WEST) orientation = D.NORTH;

        } while (!cur.equals(start));

        // mark all corners as "used" once
        return corners.map(c => c.use());
    };

    /**
     * Returns whether this corner can be part 
     * of another piece.
     * @param {number} x 
     * @param {number} y 
     */
    const hasSpace = (x, y) => {
        const used = allCorners.filter(c => c.equals(x, y));

        // if we already visited this corner, check if
        // it has still space
        // otherwise, we can just use it
        return used.length ? used[0].partOf > 0 : true;
    };

    /**
     * Updates the `allCorners` and `pieces` store.
     * @param {Point[]} piece 
     */
    const updateCorners = piece => {

        // add the new piece
        pieces.push(piece);

        for (const corner of piece) {

            const found = allCorners.filter(c => c.equals(corner));

            if (found.length === 1) {
                // corner exists already, mark it as "used"
                found[0].use();
            } else {
                // add as new
                allCorners.push(corner);
            }
        }
    };

    /**
     * Converts a `piece` into a 
     * multi-line string.
     * @param {Point[]} piece 
     */
    const pieceToString = piece => {

        //piece.unshift(piece.pop());
        const { minX, minY, maxX, maxY } = Point.boundingBox(piece);

        const normalized = piece.map(p => p.north(minX).west(minY));
        const L = normalized.length;

        const { hor: horizontal, ver: vertical } = normalized.reduce((acc, cur, idx) => {

            const next = normalized[(idx + 1) % L];

            if (cur.x === next.x) {
                acc.hor.push({ start: cur, right: next.y - cur.y > 0, len: Math.abs(cur.y - next.y) - 1 });
            } else {
                acc.ver.push({ start: cur, down: next.x - cur.x > 0, len: Math.abs(cur.x - next.x) - 1 });
            }

            return acc;

        }, { hor: [], ver: [] });

        const grid = Array.from({ length: maxX - minX + 1 }, _ => Array.from({ length: maxY - minY + 1 }, _ => ' '));

        for (const { start, len, right } of horizontal) {

            grid[start.x][start.y] = '+';
            for (let i = 1; i <= len; i++) grid[start.x][right ? start.y + i : start.y - i] = '-';
        }

        for (const { start, len, down } of vertical) {

            grid[start.x][start.y] = '+';
            for (let i = 1; i <= len; i++) grid[down ? start.x + i : start.x - i][start.y] = '|';   
        }

        return grid.map(line => line.join('').replace(/(?<=-)\+(?=-)/g, '-').replace(/ *$/g, '')).join('\n');
    };

    // iterate over the grid...
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {

            // corner found, check if we need to handle it
            if (grid[h][w] === '+' && hasSpace(h, w)) {

                // find piece for this corner
                const piece = findPiece(h, w);

                // piece found, update
                if (piece.length > 3) {
                    updateCorners(piece);
                }
            }
        }
    }

    // convert and return
    return pieces.map(pieceToString);
};