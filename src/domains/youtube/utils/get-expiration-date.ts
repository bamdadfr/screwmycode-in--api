/**
 * Utility function to get the expiration date of a YouTube video URL.
 */
export function getExpirationDate(string: string): number {
  const regex = /expire[\/=]([0-9]{10})/gm;
  const matches = regex.exec(string);
  return parseInt(matches[1], 10);
}
