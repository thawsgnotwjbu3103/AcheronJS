import * as http from "http"

export interface IRequest extends http.IncomingMessage {
  [key: string]: any
}

export interface IResponse extends http.ServerResponse {
  [key: string]: any
}

export type Handler = (req: IRequest, res: IResponse, next: () => void) => void

export interface IMethod {
  path: string,
  regexPath: RegExp,
  handlers: Handler[]
}

export type IRoute = {
  [key in "get" | "post" | "delete" | "put" | "patch"]: IMethod[];
} & { use: Handler[] }
