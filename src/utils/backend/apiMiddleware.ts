import { NextApiRequest, NextApiResponse } from "next";

export default function apiMiddleware(
  middleware: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (err?: any) => any
  ) => void
) {
  return (req: NextApiRequest, res: NextApiResponse, next: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (reject instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
