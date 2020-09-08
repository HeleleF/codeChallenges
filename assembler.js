
/**
 * simple interpreter of assembler
 * @param {string[]} program 
 */
const simple_assembler = program => {

    const REGISTER = {};

    const get = v => Number.isInteger(Number(v)) ? Number(v) : REGISTER[v];

    for (let idx = 0; idx < program.length; /**no increment here */) {

        const instruction = program[idx];
        const [op, x, y] = instruction.split(' ');

        switch (op) {

            case 'mov':
                REGISTER[x] = get(y);
                idx++;
                break;

            case 'inc':
                REGISTER[x]++;
                idx++;
                break;

            case 'dec':
                REGISTER[x]--;
                idx++;
                break;

            case 'jnz': 
                idx += get(x) !== 0 ? get(y) : 1;
                break;

            default: throw new TypeError(`Unknown OP ${op}!`);
        }
    }
	return REGISTER;
}


/**
 * Stores the register values
 * @typedef {Object.<string, number>} Register
 */

 /**
 * Stores the pointer value for each label name
 * @typedef {Object.<string, number>} Label
 */

/**
 * A message type
 * @typedef {object} Type
 * @property {'string' | 'expression'} type - The type of the message. If `expression`, we need to get its value from the register first.
 * @property {string} value - The message value
 */

/**
 * An assembler instruction
 * @typedef {object} Instruction
 * @property {string} op - The operation
 * @property {string=} x - First parameter, if exists
 * @property {string=} y - Second parameter, if exists
 * @property {Type[]=} values - Message parameters, if exists
 */

/**
 * An interpreter of assembler
 * @param {string} program 
 */
const assemblerInterpreter = program => {

    const DEFAULT_RETURN = -1;

    /**
     * Stores the register values
     * @type {Register}
     */
    const REGISTER = {};

    /**
     * Stores the instruction pointer for labels
     * @type {Label}
     */
    const LABELS = {};

    /**
     * Stores the instruction pointer from `call`s
     * @type {number[]}
     */
    const CALL_STACK = [];

    /**
     * Stores the last comparison value
     * @type {0 | 1 | -1}
     */
    let LAST_COMPARE;

    /**
     * Stores the output string
     */
    let output = '';

    /**
     * Gets either v as number or the register v
     * @param {string} v 
     * @returns {number}
     */
    const get = v => Number.isInteger(Number(v)) ? Number(v) : REGISTER[v];

    /**
     * Converts a line of assembler code
     * into an instruction object.
     * 
     * Used in `.map()`, so we pass the array index as well.
     * 
     * @param {string} ins 
     * @param {number} idx
     * @returns {Instruction}
     */
    const parseLine = (ins, idx) => {

        // extract the operation name
        const op = ins.match(/^\w+:?/)[0];
        const len = op.length;

        if (op[len - 1] === ':') {

            // store pointer for this label name, so we can reference it later
            LABELS[op.slice(0, -1)] = idx;
            return { op: 'label' };
        }
        const result = { op };

        // special case for "msg", the parameters can be strings too
        if (op === 'msg') {
            result.values = ins.slice(len).split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map(c => {
                const v = c.trim();
                if (/^'.*'$/.test(v)) {
                    return { type: 'string', value: v.slice(1, v.length - 1) };
                } else {
                    return { type: 'expression', value: v };
                }
            });
            return result;
        }

        // values that dont exist will just be undefined
        const [x, y] = ins.slice(len).split(',');

        if (x) result.x = x.trim();
        if (y) result.y = y.trim();

        return result;
    };

    const instructions = program.trim().split('\n') // split into lines
        .map(line => line.replace(/;.*$/, '').trim()) // remove whitespace and comments
        .filter(line => line.length) // remove empty lines
        .map(parseLine); // convert

    // run
    // i is the instruction pointer, so we have to update it ourself
    for (let i = 0; i < instructions.length; /**no increment here */) {

        // Instruction is always OP X Y
        const { op, x, y, values } = instructions[i];
    
        switch (op) {
            case 'mov':
                REGISTER[x] = get(y);
                i++;
                break;

            case 'inc':
                REGISTER[x]++;
                i++;
                break;

            case 'dec':
                REGISTER[x]--;
                i++;
                break;      
                
            case 'add':
                REGISTER[x] += get(y);
                i++;
                break;  

            case 'sub':
                REGISTER[x] -= get(y);
                i++;
                break;  

            case 'mul':
                REGISTER[x] *= get(y);
                i++;
                break;  

            case 'div':
                REGISTER[x] = Math.floor(REGISTER[x] / get(y));
                i++;
                break;  
            
            case 'label':
                i++;
                break;
            
            case 'jmp':
                i = LABELS[x];
                break;

            case 'cmp':
                const v1 = get(x);
                const v2 = get(y);

                LAST_COMPARE =  v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
                i++;
                break;

            case 'jne':
                i = LAST_COMPARE !== 0 ? LABELS[x] : i + 1;
                break;

            case 'je':
                i = LAST_COMPARE === 0 ? LABELS[x] : i + 1;
                break;

            case 'jge':
                i = LAST_COMPARE !== -1 ? LABELS[x] : i + 1;
                break;

            case 'jg':
                i = LAST_COMPARE === 1 ? LABELS[x] : i + 1;
                break;

            case 'jle':
                i = LAST_COMPARE !== 1 ? LABELS[x] : i + 1;
                break;

            case 'jl':
                i = LAST_COMPARE === -1 ? LABELS[x] : i + 1;
                break;
            
            case 'call':
                CALL_STACK.push(i + 1);
                i = LABELS[x]; 
                break;

            case 'ret':
                i = CALL_STACK.pop();
                break;

            case 'msg':
                output += values.map(t => t.type === 'expression' ? get(t.value) : t.value).join('');
                i++;
                break;

            case 'end': 
                return output;
            
            default: 
                throw new TypeError(`What in assembler? ${op}`);
        }
    }
    // if we reached this, there was no "end"
    return DEFAULT_RETURN;
};
