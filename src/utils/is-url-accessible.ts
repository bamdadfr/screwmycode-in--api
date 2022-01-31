import got from 'got';

export async function isUrlAccessible(url: string): Promise<boolean> {
  try {
    await got.head(url);
    return true;
  } catch {
    return false;
  }
}
