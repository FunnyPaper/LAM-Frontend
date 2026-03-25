export type DataSource<T> = {
  subscribe: (listener: (data: T) => void, error?: (reason: string) => void) => () => void;
  invalidate: () => Promise<void>;
}