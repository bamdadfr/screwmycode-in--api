/**
 * @description return true if environment is production
 */
export function isEnvProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
