/**
 * Function that adds a leading 0 to a numeric value if the value is smaller then 10
 * @param {*} value
 * @returns
 */
export const addLeadingZero = (value: number) => {
    value = parseInt(value.toString());
    return value < 10 ? `0${value}` : value;
}

/**
 * Formats a time provided in seconds to mm:ss
 * @param {*} timeValueSeconds
 * @returns
 */
export const getFormattedTime = (timeValueSeconds: number) => {
    const seconds = addLeadingZero(timeValueSeconds % 60);
    const minutes = addLeadingZero(timeValueSeconds / 60);

    return `${minutes}:${seconds}`;
}