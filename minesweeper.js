
/**
 * For MineSweeping
 */
class MineSweep {
    /**
     * Creates a new Solver
     * @param {string} map The 2d field as a string
     * @param {number} mines The number of hidden mines
     * @param {string} solution The 2d solved field as a string
     */
    constructor(map, mines, solution) {

        const lines = map.split('\n');
        this.field = lines.map(line => line.split(' '));
        this.visited = lines.map(line => line.split(' ').map(c => c !== '?'));

        this.height = this.field.length;
        this.width = this.field[0].length;

        this.mineCount = mines;
        this.tries = 0;
        this.result = '?';

        // remove this at the end
        this.solution = solution.split('\n').map(line => line.split(' '));
    }

    _updateField(x, y, val) {

        if (val === 'x') this.mineCount--;

        this.field[x][y] = val;
        this.visited[x][y] = true;
        return val;
    }

    /**
     * Whether this point was already visited
     * @param {number} x 
     * @param {number} y 
     */
    _visited(x, y) {
        return this.visited[x][y];
    }

    /**
     * Opens point on the field
     * 
     * This will be replaced by the given
     * `open()` function.
     * @param {number} x 
     * @param {number} y 
     */
    _open(x, y) {

        if (this.solution[x][y] === 'x') {
            throw new Error(`Mine at ${x}x${y}`);
        }
        return this._updateField(x, y, this.solution[x][y]);
    }

    /**
     * If a point is inside the field
     * @param {number} x 
     * @param {number} y 
     */
    _inside(x, y) {
        return x >= 0 && x < this.height && y >= 0 && y < this.width;
    };

    /**
     * Opens all neighbors recursively
     * @param {number} x 
     * @param {number} y 
     */
    _openNeighbors(x, y) {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (this._inside(i, j) && !this._visited(i, j)) {
          
                    if (this._open(i, j) === 0) {             
                        this._openNeighbors(i, j);
                    }
                }
            }
        }
    }

    _at(x, y) {
        return this._inside(x, y) ? this.field[x][y] : null;
    }

    _which(idx) {
        switch (idx) {
            case 0: return {x: -1, y: -1};
            case 1: return {x: -1, y: 0};
            case 2: return {x: -1, y: 1};
            case 3: return {x: 0, y: -1};
            case 4: return {x: 0, y: 1};
            case 5: return {x: 1, y: -1};
            case 6: return {x: 1, y: 0};
            case 7: return {x: 1, y: 1};
        }
    }

    _missingOne(x, y) {
        const neighbors = [
            this._at(x - 1, y - 1), this._at(x - 1, y), this._at(x - 1, y + 1),
            this._at(x, y - 1), this._at(x, y + 1),
            this._at(x + 1, y - 1), this._at(x + 1, y), this._at(x + 1, y + 1)
        ];

        const bombs = neighbors.filter(n => n === 'x');
        const maybeBomb = neighbors.filter(n => n === '?');

        if (bombs.length && maybeBomb.length) {

            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (this._inside(i, j) && !this._visited(i, j)) {   
                        if (this.field[i][j] === '?') this._open(i, j);      
                    }
                }
            }
            return null;
        }

        return maybeBomb.length === 1 ? this._which(neighbors.indexOf('?')) : null;
    }

    _findSingles() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.field[i][j] === '1') {

                    const r = this._missingOne(i, j);
                    if (r) this._updateField(i + r.x, j + r.y, 'x');
                };
            }
        }     
    }

    _findSinglesAll() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.field[i][j] !== '0' && this.field[i][j] !== '?' && this.field[i][j] !== 'x') {
                    this._missingOneOpen(i, j, +this.field[i][j]);
                };
            }
        }     
    }

    _missingOneOpen(x, y, cnt) {
        const neighbors = [
            this._at(x - 1, y - 1), this._at(x - 1, y), this._at(x - 1, y + 1),
            this._at(x, y - 1), this._at(x, y + 1),
            this._at(x + 1, y - 1), this._at(x + 1, y), this._at(x + 1, y + 1)
        ];

        const bombs = neighbors.filter(n => n === 'x').length;
        const unopened = neighbors.filter(n => n === '?').length;

        if (cnt - bombs == unopened) {
            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (this._inside(i, j) && !this._visited(i, j)) {   
                        if (this.field[i][j] === '?') this._updateField(i, j, 'x');      
                    }
                }
            }  
        }
        if (cnt - bombs === 0 && unopened > 0) {
            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (this._inside(i, j) && !this._visited(i, j)) {   
                        if (this.field[i][j] === '?') this._open(i, j);      
                    }
                }
            }       
        }
    }

    /**
     * 
     * @param {string} value 
     * @param {function(number, number): void} callback 
     */
    _iterateField(value, callback) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.field[i][j] === value) callback(i, j);
            }
        }    
    }

    _isGameOver() {

        if (this.mineCount === 0) {
            this.result = this.field.map(line => line.join(' ')).join('\n');
            return true;
        }
        return ++this.tries > 5;
    }

    solve() {
        while (!this._isGameOver()) {

            this._iterateField('0', this._openNeighbors.bind(this));

            this._findSingles();
            this._findSingles();
            this._findSinglesAll();
            this._findSinglesAll();
            console.log(this.getField());
        }
        return this.result;
    }

    getField() {
        return `\n${this.field.map(line => line.join(' ')).join('\n')}`;    
    }
}

const msw = new MineSweep(`? ? ? ? ? ?
? ? ? ? ? ?
? ? ? 0 ? ?
? ? ? ? ? ?
? ? ? ? ? ?
0 0 0 ? ? ?`, 6, `1 x 1 1 x 1
2 2 2 1 2 2
2 x 2 0 1 x
2 x 2 1 2 2
1 1 1 1 x 1
0 0 0 1 1 1`);

msw.solve();