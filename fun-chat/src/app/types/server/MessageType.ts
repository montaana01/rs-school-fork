export type MessageType <T> = {
  id: string | null;
  type: string;
  payload: T;
}
