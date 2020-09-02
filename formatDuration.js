/**
 * formats a duration, given as a number of seconds, 
 * in a human-friendly way.
 * @param {number} seconds 
 */
const formatDuration = seconds => {

    const DUR = ['year', 'day', 'hour', 'minute', 'second'];

    if (seconds === 0) return 'now';
    const duration = [];
    
    duration.push(Math.floor(seconds / 31_536_000));
    seconds = seconds % 31_536_000;

    duration.push(Math.floor(seconds / 86_400));
    seconds = seconds % 86_400;

    duration.push(Math.floor(seconds / 3_600));
    seconds = seconds % 3_600;

    duration.push(Math.floor(seconds / 60));
    seconds = seconds % 60;

    duration.push(seconds);

    return duration.map((d, i) => d > 0 ? `${d} ${DUR[i]}${d > 1 ? 's' : ''}` : '')
        .join(', ')
        .replace(/, $|(?<!\w), /g, '')
        .replace(/, $/, '')
        .replace(/, (\d+ \w+)$/, ' and $1');
}