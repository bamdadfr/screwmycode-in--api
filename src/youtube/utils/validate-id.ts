import * as ytdl from 'ytdl-core';

/**
 * @description throws if not valid
 */
export function validateId(id: string): void {
  const isValid = ytdl.validateID(id);
  if (!isValid) throw new Error('id is not valid');
  return;
}
