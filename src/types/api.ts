export type ApiResponse<T> = {
  items?: T[];
  item?: T;
  error?: string;
  ok?: boolean;
  id?: string;
  message?: string;
};