import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Express's app is a request listener function (req, res) => void
    // tailored for Node's http.Server.
    // VercelRequest and VercelResponse are compatible with Node's req/res.
    app(req, res);
}
