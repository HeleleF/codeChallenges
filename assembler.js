
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