/**
 * @function youtubeIdIsValid
 * @description basic regex test to check if youtube id is valid
 * @param {string} id - youtube id
 * @returns {boolean}
 */
export function youtubeIdIsValid(id: string): boolean {
  const regEx = /^([0-9A-Za-z_-]{11})$/;
  return regEx.test(id);
}
