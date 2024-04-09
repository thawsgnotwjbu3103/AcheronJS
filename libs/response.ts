import { Request, Response, ResponseConfig } from "./type"
import { CONTENT_TYPE } from "./constant"
import * as fs from "fs"
import * as hbs from "handlebars"

export default class ResultResponse {
  get res(): Response {
    return this._res
  }

  set res(value: Response) {
    this._res = value
  }

  private _res: Response

  get req(): Request {
    return this._req
  }

  set req(value: Request) {
    this._req = value
  }

  private _req: Request

  constructor(req: Request, res: Response) {
    this._req = req
    this._res = res
  }


  notFoundReturn = () => {
    this._res.writeHead(404, { "Content-Type": CONTENT_TYPE[".txt"] })
    this._res.end(`Not Found - ${this._req.method} - ${this._req.url}`, "utf-8")
  }

  jsonReturn = (object: any, config: ResponseConfig | undefined = {}) => {
    this._res.writeHead(config.statusCode || 200, { "Content-Type": config.contentType || CONTENT_TYPE[".json"] })
    this._res.end(JSON.stringify(object), config.encoding || "utf-8")
  }

  sendReturn = (body: any, config: ResponseConfig | undefined = {}) => {
    this._res.writeHead(config.statusCode || 200, { "Content-Type": config.contentType || CONTENT_TYPE[".txt"] })
    this._res.end(body, config.encoding || "utf-8")
  }

  renderReturn = (filePath: string, object: any, config: ResponseConfig | undefined = {}) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        this.internalErrorReturn("Internal Server Error")
        return
      }
      this._res.writeHead(config.statusCode || 200, { "Content-Type": config.contentType || CONTENT_TYPE[".html"] })
      const body = hbs.compile(data.toString())
      this._res.end(body(object), config.encoding || "utf-8")
      return
    })
  }

  internalErrorReturn = (body: any) => {
    this._res.writeHead(500, { "Content-Type": CONTENT_TYPE[".txt"] })
    this._res.end(body, "utf-8")
  }

}