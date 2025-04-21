export default class ServerError extends Error {
  public payload: { error: string };
  constructor(payload: { error: string }) {
    super(payload.error);
    this.name = 'ServerError';
    this.payload = payload;
  }
}
