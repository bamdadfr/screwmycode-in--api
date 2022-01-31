export function getNowDate(): number {
  return parseInt(Date.now().toString().slice(0, 10), 10);
}
