import * as http from "http"
import * as fs from "fs"
import * as hbs from "handlebars"

import Route from "./route"
import { DEFAULT_PORT } from "./constant"
import { IRequest, IResponse, IRoute } from "./type"


export default class AcheronJS {
  private r = new Route()

  use = this.r.use
  get = this.r.get
  delete = this.r.delete
  patch = this.r.patch
  post = this.r.post
  put = this.r.put
  routes = this.r


  private notFound = (req: IRequest, res: IResponse) => {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end(`Not Found - ${req.method} - ${req.url}`)
  }

  private json = (object: any, req: IRequest, res: IResponse) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(object))
  }

  private send = (body: any, req: IRequest, res: IResponse) => {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end(body)
  }

  private render = (filePath: string, object: any, req: IRequest, res: IResponse) => {
    res.writeHead(200, { "Content-Type": "text/html" })
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      const body = hbs.compile(data.toString())
      res.end(body(object))
    })
  }

  initialize = (req: IRequest, res: IResponse) => {
    res.json = (object: any) => this.json(object, req, res)
    res.notFound = () => this.notFound(req, res)
    res.send = (body: any) => this.send(body, req, res)
    res.render = (filePath: string, object: any) => this.render(filePath, object, req, res)
  }


  listen = (port: number = DEFAULT_PORT, listeningListener?: () => void) => {
    const server = http.createServer((req, res) => {
      this.initialize(req, res)

      let index = 0
      const next = () => {
        const url = req.url
        if (index < this.r.use.length) {
          this.r.routes.use[index++]
        }

        if (url) {
          const method = (req.method && req.method.toLowerCase() || "get") as keyof IRoute
          const routes = this.r.routes[method].find(route => "path" in route && "handlers" in route && route.regexPath.test(url))
          if (routes && "path" in routes && "handlers" in routes) {
            for (const handler of routes.handlers) {
              handler(req, res, next)
            }
          } else {
            this.notFound(req, res)
          }
        } else {
          this.notFound(req, res)
        }
      }

      next()
    })

    server.listen(port, listeningListener)
  }

}
