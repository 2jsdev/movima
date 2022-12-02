export function endRequest(status: 400 | 401 | 403, message: string, res: any): any {
  return res.status(status).send({ message });
}
