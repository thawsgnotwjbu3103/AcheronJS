import { Request, Response } from "./type"
import * as requestIp from "request-ip"
import Utils from "./utils"
import formidable from "formidable"
import * as cookie from "cookie"

export default class ClientRequest {
  private _res: Response
  private _req: Request
  private utils = new Utils()
  private _option: formidable.Options | undefined

  get option(): formidable.Options | undefined {
    return this._option
  }

  set option(value: formidable.Options | undefined) {
    this._option = value
  }

  get res(): Response {
    return this._res
  }

  set res(value: Response) {
    this._res = value
  }


  get req(): Request {
    return this._req
  }

  set req(value: Request) {
    this._req = value
  }


  constructor(req: Request, res: Response, formidableOption: formidable.Options | undefined) {
    this._req = req
    this._res = res
    this._option = formidableOption

  }

  getClientIp = () => {
    return requestIp.getClientIp(this._req)
  }

  params = (pathRegex: RegExp, path: string) => {
    return this.utils.getParams(this._req, pathRegex, path)
  }

  query = () => {
    return this.utils.getQuery(this._req)
  }

  bodyParser = async (formidableOptions: formidable.Options | undefined) => {
    return await this.utils.getBody(this._req, formidableOptions)
  }

  cookies = () => {
    const cookieStr = this._req.headers["cookie"]
    if (!cookieStr) return {}
    return cookie.parse(cookieStr)
  }

  initializeRequest = () => {
    this._req.clientIp = this.getClientIp()
    this._req.body = this.bodyParser(this._option)
    this._req.cookies = this.cookies()
    this._req.query = this.query()
  }


}