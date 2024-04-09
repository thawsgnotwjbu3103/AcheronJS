import * as http from "http"
import * as requestIp from "request-ip"
import formidable from "formidable"

import { DEFAULT_MAX_FILE_SIZE, DEFAULT_PORT } from "./constant"
import { Handler, Method, Request, Response, ResponseConfig, RouteType } from "./type"
import Route from "./route"
import Static from "./static"
import ResultResponse from "./response"
import Utils from "./utils"


export default class AcheronJS {

  private r = new Route()
  private s = new Static()
  private u = new Utils()

  private formidableOptions: formidable.Options | undefined = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE
  }

  use = this.r.use
  get = this.r.get
  delete = this.r.delete
  patch = this.r.patch
  post = this.r.post
  put = this.r.put
  routes = this.r.routes

  static = this.s.static

  formidable = (options?: formidable.Options) => this.formidableOptions = options

  initialize = async (req: Request, res: Response) => {
    const rr = new ResultResponse(req, res)

    req.clientIp = requestIp.getClientIp(req)

    res.notFound = () => rr.notFoundReturn()
    res.internalError = (body: any) => rr.internalErrorReturn(body)
    res.json = (object: any, config: ResponseConfig | undefined = {}) => rr.jsonReturn(object, config)
    res.send = (body: any, config: ResponseConfig | undefined = {}) => rr.sendReturn(body, config)
    res.render = (filePath: string, object: any, config: ResponseConfig | undefined = {}) => rr.renderReturn(filePath, object, config)

    let index = 0
    const next = async () => {
      if (index < this.use.length) {
        const middleware = this.routes.use[index++]
        middleware(req, res, next)
      } else {
        const url = req.url
        if (!url) return rr.notFoundReturn()
        const method = (req.method && req.method.toLowerCase() || "get") as keyof RouteType
        const exactRoute = this.routes[method].find(route => "path" in route && "handlers" in route && route.regexPath.test(url)) as Method
        if (!exactRoute) return rr.notFoundReturn()
        const handlers = exactRoute.handlers as Handler[]
        await Promise.all(handlers.map(async handler => {
          req.params = this.u.getParams(req, exactRoute.regexPath, exactRoute.path)
          req.query = this.u.getQuery(req)
          await this.u.getBody(req, this.formidableOptions)
          await handler(req, res, next)
        }))
      }
    }
    await next()
  }

  listen = (port: number = DEFAULT_PORT, listeningListener?: () => void) => {
    const server = http.createServer(async (request, response) => {
      const req = request as Request
      const res = response as Response
      await this.initialize(req, res)
    })

    server.listen(port, listeningListener)
  }

}
