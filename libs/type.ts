import * as http from "http"
import { CONTENT_TYPE } from "./constant"

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
  files: {
    [key: string]: any
  };
  cookies: {
    [key: string]: any
  }
  clientIp: string | null;

  [key: string]: any
}

export interface Response extends http.ServerResponse {
  json: (object: any, config?: ResponseConfig) => void;
  send: (body: any, config?: ResponseConfig) => void;
  render: (filePath: string, object: any, config?: ResponseConfig) => void;
  internalError: (body: any) => void
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

export type ContentTypeKey = keyof typeof CONTENT_TYPE

export type ResponseConfig = {
  statusCode?: number;
  contentType?: string;
  encoding?: BufferEncoding
}
