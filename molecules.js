class InvalidBond extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class UnlockedMolecule extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class LockedMolecule extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class EmptyMolecule extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class UnexpectedMolecule extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * A bond between two atoms as an array of four integers `[c1,b1,c2,b2]`.
 * - `c1, b1`: carbon and branch number of the first atom
 * - `c2, b2`: carbon and branch number of the second atom
 * - All numbers are 1-indexed, meaning `[1,1,5,3]` will bound the first carbon of the first branch with the fifth of the third branch.
 * - Only positive numbers will be used.
 * @typedef {[number, number, number, number]} Bond
 */

/**
 * A mutation as an array of three: `[nc, nb, elt]`
 * 
 * Mutates the carbon numbered `nc` in the branch numbered `nb` to the chemical element `elt`, as a string.
 * @typedef {[number, number, string]} Mutation
 */

/**
* An Atom as an array of three: `[nc, nb, elt]`
* 
* Adds a new Atom of kind `elt` on the carbon number `nc` in the branch `nb`.
* @typedef {[number, number, string]} ExtraAtom
*/

/**
 * Instances of this class represent atoms in a specific Molecule instance 
 * and the bonds they hold with other Atom instances.
 */
class Atom {

    /**
     * Instances of this class represent atoms in a specific Molecule instance and the bonds they hold with other Atom instances.
     * @param {string} element symbol of the current Atom instance
     * @param {number} id id of the current element (beginning at 1 for each Molecule instance)
     */
    constructor(element, id) {
        this.element = element;
        this.id = id;

        this.molWeight = Atom.getMolWeight(element);
        this.valenceNumber = Atom.getValenceNumber(element);

        /**
         * @type {Atom[]}
         */
        this._boundTo = [];
    }

    /**
     * Binds two atoms together.
     * @param {Atom} otherAtom 
     */
    bindTo(otherAtom) {

        if (this._boundTo.length === this.valenceNumber) {
            throw new InvalidBond(`Atom ${this} can't bind to other atom ${otherAtom} since it's already maxed out!`);
        }

        if (otherAtom._boundTo.length === otherAtom.valenceNumber) {
            throw new InvalidBond(`Other Atom ${otherAtom} can't be bound to atom ${this} since it's already maxed out!`);
        }

        if (otherAtom === this) {
            throw new InvalidBond(`Atom ${this} can't bind to itself!`);
        }

        this._boundTo.push(otherAtom);
        otherAtom._boundTo.push(this);

        return this;
    }

    /**
     * Unbinds two atoms that were bound together.
     * @param {Atom} otherAtom 
     */
    unbindFrom(otherAtom) {

        const idx = this._boundTo.findIndex(a => a === otherAtom);
        this._boundTo.splice(idx, 1);

        const idx2 = otherAtom._boundTo.findIndex(a => a === this);
        otherAtom._boundTo.splice(idx2, 1);
    }

    static getMolWeight(element) {

        switch (element) {

            case 'H': return 1.0;
            case 'F': return 19.0;
            case 'Cl': return 35.5;
            case 'Br': return 80.0;
            case 'O': return 16.0;
            case 'Mg': return 24.3;
            case 'S': return 32.1;
            case 'B': return 10.8;
            case 'N': return 14.0;
            case 'P': return 31.0;
            case 'C': return 12.0;

            default: throw new TypeError(`Don't know element ${element}!`);
        }
    }

    static getValenceNumber(element) {

        switch (element) {

            case 'H':
            case 'F':
            case 'Cl':
            case 'Br':
                return 1;

            case 'O':
            case 'Mg':
            case 'S':
                return 2;

            case 'B':
            case 'N':
            case 'P':
                return 3;

            case 'C':
                return 4;

            default: throw new TypeError(`Don't know element ${element}!`);
        }
    }

    /**
     * Updates id of atom
     * @param {number} newId 
     */
    updateID(newId) {
        this.id = newId;
        return this;
    }

    mutate(newElement) {

        const bonds = this._boundTo.length;
        const newValence = Atom.getValenceNumber(newElement);

        if (bonds > newValence) {
            throw new InvalidBond(`Can't mutate into ${newElement} since its valence number ${newValence} is smaller than the number of existing bonds ${bonds}!`);
        }

        this.element = newElement;

        this.molWeight = Atom.getMolWeight(newElement);
        this.valenceNumber = newValence;

        return this;
    }

    addHydrogen(startId) {

        const missing = this.valenceNumber - this._boundTo.length;

        for (let i = 1; i <= missing; i++) {
            const hydrogen = new Atom('H', i + startId);
            this.bindTo(hydrogen);
        }
        return missing;
    }

    removeHydrogen() {

        const boundHydrogen = this._boundTo.filter(b => b.element === 'H');

        for (const hydrogen of boundHydrogen) {
            this.unbindFrom(hydrogen);
        }
        return boundHydrogen.length;
    }

    getHydrogen() {
        return this._boundTo.filter(b => b.element === 'H');
    }

    getBonds() {
        return this._boundTo;
    }

    /**
     * Visit all atoms along the chain.
     * @param {Atom[]} collector 
     */
    visitAll(collector = []) {

        if (!collector.includes(this)) collector.push(this);

        const unvisitedBonds = this._boundTo.filter(b => !collector.includes(b));

        for (const b of unvisitedBonds) {
            b.visitAll(collector);
        }
        return collector;
    }

    /**
     * Compares two atoms.
     * - First compare elements by ascii value
     * - Second compare by id
     * @param {Atom} a 
     * @param {Atom} b 
     */
    static sortFunc(a, b) {

        const cmp = a.element.localeCompare(b.element);
        return cmp === 0 ? a.id - b.id : cmp;
    }

    /**
     * Returns a string formatted like the following: "Atom(`element`.`id`: `element1id`,`element2id`,`element3id`...)".
     *
     * `element1id`: element1, bonded to the current Atom and its `id`. 
     * 
     * If the bonded atom is a hydrogen, do not display its `id`, to increase readability.
     * 
     * The elements bonded to the current atom must be sorted in the same order than for the raw formula, except that the hydrogens will go to the end, again for better readability.
     * 
     * Atoms of the same chemical element are sorted by increasing value of their `id`.
     * If an atom isn't bonded to any other atom, then just return the `element`.`id` part: "Atom(H.12)".
     *
     * Examples: "Atom(C.2: C3,C14,O6,H)" or "Atom(C.24: C1,O6,N2,H)", or "Atom(C.1)"
     */
    toString() {

        const carbsAndOxy = this._boundTo.filter(a => ['C', 'O'].includes(a.element)).sort(Atom.sortFunc);
        const other = this._boundTo.filter(a => !['C', 'O', 'H'].includes(a.element)).sort(Atom.sortFunc);
        const hydros = this._boundTo.filter(a => a.element === 'H');

        const bonds = carbsAndOxy.concat(other, hydros).map(a => `${a.element}${a.element !== 'H' ? a.id : ''}`).join(',');

        //const bonds = this._boundTo.map(a => `${a.element}${a.element !== 'H' ? a.id : ''}`).join(',');

        return `Atom(${this.element}.${this.id}${bonds ? ': ' : ''}${bonds})`;
    }
}

/**
 * This is the main object, the "builder of things", representing the whole molecule, its properties and atoms, 
 * and holding all the related methods to build and modify the molecule object.
 */
class Molecule {

    /**
     * This is the main object, the "builder of things", representing the whole molecule, its properties and atoms, 
     * and holding all the related methods to build and modify the molecule object.
     * @param {string} name 
     */
    constructor(name = '') {

        /**
         * @type {string}
         */
        this._name = name;

        this._locked = false;
        /**
         * @type {Atom[][]}
         */
        this._branches = [];
        this._lastAtomId = 0;
        /**
         * Atoms of the molecule
         * that are not part of any branch, making them
         * 'unreachable'
         * @type {Atom[]}
         */
        this._extra = [];

        console.log(`var p = new Molecule('${name}');`);
    }

    /**
     * Helper to add Hydrogen everywhere
     * @private
     */
    _addHydrogen() {

        // now that we have everything, add hydrogen everywhere
        for (const atom of this.atoms) {
            const added = atom.addHydrogen(this._lastAtomId);
            this._lastAtomId += added;
        }
    }

    /**
     * Helper to remove Hydrogen everywhere.
     * Also removes empty branches.
     * @private
     */
    _removeHydrogen() {

        for (const atom of this.atoms) {
            atom.removeHydrogen();
        }

        for (const [idx, branch] of this._branches.entries()) {
            this._branches[idx] = branch.filter(a => a.element !== 'H');
        }

        this._extra = this._extra.filter(e => e.element !== 'H');

        this._branches = this._branches.filter(b => b.length > 0);
    }

    /**
     * Updates all Ids to be continuos.
     * @private
     */
    _makeContinuousIds() {

        this._lastAtomId = 0;

        for (const atom of this.atoms) {
            atom.updateID(++this._lastAtomId);
        }
    }

    /**
     * @private
     * @param {number} carbonCount 
     */
    _createBranch(carbonCount) {

        const newBranch = [];

        for (let i = 1; i <= carbonCount; i++) {

            const carbon = new Atom('C', i + this._lastAtomId);

            if (i > 1) {
                const previousCarbon = newBranch[i - 2];
                previousCarbon.bindTo(carbon);
            }

            newBranch.push(carbon);
        }

        this._branches.push(newBranch);
        this._lastAtomId += carbonCount;
    }

    /**
     * Adds new "branches" of carbons, to the current molecule. 
     * 
     * - All carbons of one branch are bounded together (chained).
     * - Each argument gives the number of carbons of one branch.
     * - All branches have to be created in the provided order.
     * @param  {...number} branches 
     */
    brancher(...branches) {

        if (this._locked) {
            throw new LockedMolecule(`Attempted to create branches while molecule is locked!`);
        }

        for (const b of branches) {
            this._createBranch(b);
        }

        return this;
    }

    /**
     * Creates new bonds between two atoms of already existing branches.
     * @param  {...Bond} bonds 
     */
    bounder(...bonds) {

        if (this._locked) {
            throw new LockedMolecule(`Attempted to create bonds while molecule is locked!`);
        }

        const numOfBranches = this._branches.length;

        for (const [c1, b1, c2, b2] of bonds) {

            if (b1 > numOfBranches) {
                throw new UnexpectedMolecule(`Cant bind from branch ${b1} since it doesnt exist`);
            }
            if (b2 > numOfBranches) {
                throw new UnexpectedMolecule(`Cant bind to branch ${b2} since it doesnt exist`);
            }
            if (c1 > this._branches[b1 - 1].length) {
                throw new UnexpectedMolecule(`Cant bind from carbon ${c1} since it doesnt exist`);
            }
            if (c2 > this._branches[b2 - 1].length) {
                throw new UnexpectedMolecule(`Cant bind to carbon ${c2} since it doesnt exist`);
            }

            this._branches[b1 - 1][c1 - 1].bindTo(this._branches[b2 - 1][c2 - 1]);
        }

        return this;
    }

    /**
     * Mutates the carbon numbered `nc` in the branch numbered `nb` to the chemical element `elt`, as a string.
     * 
     * **This is mutation: the `id` of the Atom instance stays the same**
     * @param  {...Mutation} mutations 
     */
    mutate(...mutations) {

        if (this._locked) {
            throw new LockedMolecule(`Attempted to mutate while molecule is locked!`);
        }

        const numOfBranches = this._branches.length;

        for (const [nc, nb, elt] of mutations) {

            if (nb > numOfBranches) {
                throw new UnexpectedMolecule(`Cant mutate atom to ${elt} in branch ${nb} since it doesnt exist`);
            }
            if (nc > this._branches[nb - 1].length) {
                throw new UnexpectedMolecule(`Cant mutate atom to ${elt} on carbon ${nc} since it doesnt exist`);
            }

            this._branches[nb - 1][nc - 1].mutate(elt);
        }

        return this;
    }

    /**
     * Adds a new Atom of kind elt (string) on the carbon number nc in the branch nb.
     * 
     * Atoms added this way are not considered as being part of the branch they are bounded to.
     * @param  {...ExtraAtom} atoms 
     */
    add(...atoms) {

        if (this._locked) {
            throw new LockedMolecule(`Attempted to mutate while molecule is locked!`);
        }

        const numOfBranches = this._branches.length;

        for (const [nc, nb, elt] of atoms) {

            if (nb > numOfBranches) {
                throw new UnexpectedMolecule(`Cant add atom ${elt} in branch ${nb} since it doesnt exist`);
            }
            if (nc > this._branches[nb - 1].length) {
                throw new UnexpectedMolecule(`Cant add atom ${elt} in branch ${nb} since it doesnt exist`);
            }

            const newAtom = new Atom(elt, this._lastAtomId + 1);
            this._branches[nb - 1][nc - 1].bindTo(newAtom);

            // binding was successful, increase
            this._lastAtomId++;

            this._extra.push(newAtom);

        }
        return this;
    }

    /**
     * Adds all the elements provided as arguments one after the other, 
     * starting from the carbon nc in the branch nb. 
     * 
     * Meaning: m.add_chaining(2, 5, "C", "C", "C", "Mg", "Br") will add the chain ...-C-C-C-Mg-Br to the atom number 2 in the branch 5.
     * @param {number} nc 
     * @param {number} nb 
     * @param  {...string} elements 
     */
    addChaining(nc, nb, ...elements) {

        console.log(`p.addChaining(${nc},${nb},${elements.map(m => `'${m}'`)});`);

        if (this._locked) {
            throw new LockedMolecule(`Attempted to mutate while molecule is locked!`);
        }

        if (!elements.length) {
            throw new UnexpectedMolecule(`A chain needs atleast one new atom!`);
        }

        const numOfBranches = this._branches.length;
        if (nb > numOfBranches) {
            throw new UnexpectedMolecule(`Cant add atom chain in branch ${nb} since it doesnt exist`);
        }
        if (nc > this._branches[nb - 1].length) {
            throw new UnexpectedMolecule(`Cant add atom chain to atom ${nc} since it doesnt exist`);
        }

        const atomChain = [new Atom(elements[0], this._lastAtomId + 1)];

        for (let i = 1; i < elements.length; i++) {

            const atom = new Atom(elements[i], this._lastAtomId + 1 + i);

            atomChain[i - 1].bindTo(atom);
            atomChain.push(atom);
        }

        this._branches[nb - 1][nc - 1].bindTo(atomChain[0]);
        this._extra.push(...atomChain);
        this._lastAtomId += atomChain.length;

        return this;
    }

    /**
     * Finalizes the molecule instance, adding missing hydrogens everywhere 
     * and locking the object
     */
    closer() {

        console.log(`p.closer();`);

        if (this._locked) {
            throw new LockedMolecule(`Attempted to lock molecule that is already locked!`);
        }

        this._addHydrogen();
        this._locked = true;
        return this;
    }

    /**
     * Makes the molecule mutable again.
     * 
     * - Hydrogens should be removed, as well as any empty branch you might encounter during the operation.
     * - After unlocking a molecule, if by any (bad...) luck it does not have any branch left, throw an EmptyMolecule exception.
     * - The id numbers of the remaining atoms are to be modified so that they are continuous (beginning at 1), keeping the order they had before unlocking the molecule.
     * - If when removing hydrogens you end up with some atoms that aren't connected in any way to the branches of the unlocked molecule, 
     * keep them anyway in the Molecule instance.
     * - Once unlocked, the molecule has to be modifiable again, in any way.
     */
    unlock() {

        console.log(`p.unlock();`);

        this._removeHydrogen();

        if (!this._branches.length) {
            throw new EmptyMolecule(`Molecule has no branches left after unlocking!`);
        }
        this._makeContinuousIds();

        this._locked = false;
        return this;
    }

    /**
     * To get the raw formula of the final molecule as a string 
     * 
     * Example: "C4H10", "C5H10O2BrClS"
     */
    get formula() {
        if (!this._locked) {
            throw new UnlockedMolecule(`Attempted to access formula while molecule isn't locked`);
        }

        const counts = this.atoms.reduce((counter, atom) => {
            counter[atom.element] = (counter[atom.element] || 0) + 1;
            return counter;
        }, {});
        const keys = Object.keys(counts);

        const standardAtoms = keys.filter(a => ['C', 'H', 'O'].includes(a)).sort();
        const rest = keys.filter(a => !['C', 'H', 'O'].includes(a)).sort();

        return standardAtoms.concat(rest).map(a => `${a}${counts[a] > 1 ? counts[a] : ''}`).join('');
    }

    /**
     * To get a list of Atom objects. 
     * 
     * Atoms are appended to the list in the order of their creation:
     * @returns {Atom[]}
     */
    get atoms() {

       let connectedAtoms = [];

        for (const branch of this._branches) {

            const startAtom = branch[0];

            if (!startAtom) {
                console.log(`Branch is empty!`);
                continue;
            }

            connectedAtoms = startAtom.visitAll(connectedAtoms);
        }

        for (const freeAtom of this._extra) {
            connectedAtoms = freeAtom.visitAll(connectedAtoms);
        }

        return connectedAtoms.sort((a, b) => a.id - b.id);
    }

    /**
     * To get the name of the molecule
     */
    get name() {
        return this._name;
    }

    /**
     * To get the value of the molecular weight of the final molecule in `g/mol`, as a double value
     */
    get molecularWeight() {
        if (!this._locked) {
            throw new UnlockedMolecule(`Attempted to access molecularWeight while molecule isn't locked`);
        }
        return this.atoms.reduce((sum, atom) => sum + atom.molWeight, 0);
    }

    set formula(formula) {
        if (this._locked) {
            throw new LockedMolecule(`Attempted to set formula while molecule is locked!`);
        }
        // this makes no sense :)
    }

    set atoms(atoms) {
        if (this._locked) {
            throw new LockedMolecule(`Attempted to set atoms while molecule is locked!`);
        }
        // this makes no sense :)
    }

    set name(name) {
        if (this._locked) {
            throw new LockedMolecule(`Attempted to set name while molecule is locked!`);
        }
        this._name = name;
    }

    set molecularWeight(molecularWeight) {
        if (this._locked) {
            throw new LockedMolecule(`Attempted to set molecularWeight while molecule is locked!`);
        }
        // this makes no sense :)
    }
}