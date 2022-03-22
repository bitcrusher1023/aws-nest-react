import path from 'path';
import { URL } from 'url';

export function getCurrentDirectory(meta: { url: string }) {
  return path.parse(new URL(meta.url).pathname).dir;
}
