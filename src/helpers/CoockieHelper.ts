import { IncomingMessage } from "http";

export function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const key = name.trim();
    const value = rest.join('=').trim();
    list[key] = decodeURIComponent(value);
  });

  return list;
}