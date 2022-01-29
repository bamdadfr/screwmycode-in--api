import { Soundcloud } from '../schemas/soundcloud.schema.js';

export function getSoundcloudUrl(id: Soundcloud['id']): string {
  return `https://soundcloud.com/${id}`;
}
