import * as http from "http"

export interface Request extends http.IncomingMessage {
  params: {
    [key: string]: any
  };
  query: {
    [key: string]: any
  };
  body: {
    [key: string]: any
  };

  [key: string]: any
}

export interface Response extends http.ServerResponse {
  json: (object: any) => void;
  send: (body: any) => void;
  render: (filePath: string, object: any) => void;
  notFound: () => void;

  [key: string]: any
}

export type Handler = (req: Request, res: Response, next: () => void) => Promise<void> | void

export interface Method {
  path: string,
  regexPath: RegExp,
  handlers: Handler[]
}

export type RouteType = {
  [key in "get" | "post" | "delete" | "put" | "patch"]: Method[];
} & { use: Handler[] }
