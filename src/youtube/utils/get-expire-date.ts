/**
 * check the expiry date with regex
 * @param string {string} - string to test with regex
 * @param isDash {boolean} - specific rules for dash files from youtube
 * @returns {number}
 */
export function getExpireDate(string: string, isDash: boolean): number {
  let response: string;
  if (isDash) {
    const regEx = /expire\/[0-9]{10}/gm;

    response = regEx.exec(string)[0].replace('expire/', '');
  } else {
    const regEx = /expire=[0-9]{10}/gm;

    response = regEx.exec(string)[0].replace('expire=', '');
  }

  return parseInt(response, 10);
}
