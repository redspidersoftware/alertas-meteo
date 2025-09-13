declare module "tar-stream" {
  import { Readable, Writable } from "stream";

  export function extract(): {
    on(event: "entry", listener: (header: { name: string }, stream: Readable, next: () => void) => void): void;
    on(event: "finish", listener: () => void): void;
    on(event: "error", listener: (err: Error) => void): void;
    end(buffer?: Buffer): void;
  };

  export function pack(): {
    entry(header: { name: string; size?: number; type?: string }, callback?: () => void): Readable;
    finalize(): void;
    pipe(destination: Writable): this;
  };

  export type Headers = { name: string; size?: number; type?: string };
}
