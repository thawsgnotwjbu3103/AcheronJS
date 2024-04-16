import * as http from "http"
import { IncomingHttpHeaders } from "http"
import { CONTENT_TYPE } from "./constant"
import { CookieSerializeOptions } from "cookie"
import { SendOptions, SendStream } from "send"

export interface Request extends http.IncomingMessage {
  params: { [key: string]: any };
  query: { [key: string]: any };
  body: { [key: string]: any };
  files: { [key: string]: any };
  cookies: { [key: string]: any }
  clientIp: string | null;

  [key: string]: any
}

export interface Response extends http.ServerResponse {
  json: (object: any, config?: ResponseConfig) => void;
  send: (body: any, config?: ResponseConfig) => void;
  render: (filePath: string, object: any, config?: ResponseConfig) => void;
  internalError: (body: any) => void
  notFound: () => void;
  cookie: (name: string, value: string, options?: CookieSerializeOptions) => void,
  set: (headers: Headers) => void,
  append: (name: string, value: string) => void;
  get: (name: string) => number | string | string[] | undefined;
  attachment: (filename: string | undefined) => void;
  download: (pathDir: string, filename: string | null, options: Options | null, callback: Callback) => void;
  sendFile: (path: string | undefined, options: Options | null, callback: Callback) => void;
  fileTransfer: (file: SendStream, opts: Options | {}, callback: Callback) => void;
  clearCookie: (name: string, options: CookieSerializeOptions) => void;

  [key: string]: any
}

export type Handler = (req: Request, res: Response, next: () => void) => Promise<void> | void

export interface Method {
  path: string,
  regexPath: RegExp,
  handlers: Handler[]
}

export type MethodHandler = (path: string, ...handlers: Handler[]) => void

export type RouterHandler = {
  [key in "get" | "post" | "delete" | "put" | "patch"]: MethodHandler
}

export type Headers = {
  [key in keyof IncomingHttpHeaders]: string | undefined
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

export type Callback = (error: NodeJS.ErrnoException | null, data: string | Buffer | null) => void;

export type Options = {
  headers: Headers
} & SendOptions