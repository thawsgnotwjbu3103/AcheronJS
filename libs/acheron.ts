import * as http from "http"
import * as fs from "fs"
import * as hbs from "handlebars"


import Route from "./route"
import { DEFAULT_PORT } from "./constant"
import { Handler, Method, Request, Response, RouteType } from "./type"
import { getBody, getParams, getQuery } from "./utils"


export default class AcheronJS {

  private r = new Route()

  use = this.r.use
  get = this.r.get
  delete = this.r.delete
  patch = this.r.patch
  post = this.r.post
  put = this.r.put
  routes = this.r.routes

  private notFoundReturn = (req: Request, res: Response) => {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end(`Not Found - ${req.method} - ${req.url}`)
  }

  private jsonReturn = (object: any, req: Request, res: Response) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(object))
  }

  private sendReturn = (body: any, req: Request, res: Response) => {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end(body)
  }

  private renderReturn = (filePath: string, object: any, req: Request, res: Response) => {
    res.writeHead(200, { "Content-Type": "text/html" })
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      const body = hbs.compile(data.toString())
      res.end(body(object))
    })
  }

  initialize = (req: Request, res: Response) => {
    res.json = (object: any) => this.jsonReturn(object, req, res)
    res.notFound = () => this.notFoundReturn(req, res)
    res.send = (body: any) => this.sendReturn(body, req, res)
    res.render = (filePath: string, object: any) => this.renderReturn(filePath, object, req, res)
  }


  listen = (port: number = DEFAULT_PORT, listeningListener?: () => void) => {
    const server = http.createServer(async (request, response) => {
      const req = request as Request
      const res = response as Response
      this.initialize(req, res)

      let index = 0
      const next = async () => {
        const url = req.url
        if (!url) return this.notFoundReturn(req, res)

        if (index < this.use.length) this.routes.use[index++]

        const method = (req.method && req.method.toLowerCase() || "get") as keyof RouteType
        const exactRoute = this.routes[method].find(route => "path" in route && "handlers" in route && route.regexPath.test(url)) as Method
        if (!exactRoute) return this.notFoundReturn(req, res)

        const handlers = exactRoute.handlers as Handler[]

        await Promise.all(handlers.map(async handler => {
          req.params = getParams(req, exactRoute.regexPath, exactRoute.path)
          req.query = getQuery(req)
          req.body = getBody(req)

          await handler(req, res, next)
        }))
      }
      await next()
    })

    server.listen(port, listeningListener)
  }

}
