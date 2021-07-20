/**
 * @description parse the expiration date with regex
 */
export function getExpirationDate(string: string, isDash: boolean): number {
  if (isDash) {
    const regex = /expire\/[0-9]{10}/gm;
    const response = regex.exec(string)[0].replace('expire/', '');
    return parseInt(response, 10);
  }

  const regex = /expire=[0-9]{10}/gm;
  const response = regex.exec(string)[0].replace('expire=', '');
  return parseInt(response, 10);
}
