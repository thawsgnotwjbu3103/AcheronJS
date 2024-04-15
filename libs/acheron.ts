import * as http from "http"
import formidable from "formidable"

import { DEFAULT_MAX_FILE_SIZE, DEFAULT_PORT } from "./constant"
import { Handler, Method, Request, Response, RouteType } from "./type"
import Route from "./route"
import Static from "./static"
import ServerResponse from "./response"
import ClientRequest from "./request"


export default class AcheronJS {

  private router = new Route()
  private serve = new Static()

  private formidableOptions: formidable.Options | undefined = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE // set default size for uploaded file is 128MB
  }

  use = this.router.use
  get = this.router.get
  delete = this.router.delete
  patch = this.router.patch
  post = this.router.post
  put = this.router.put
  register = this.router.register
  routes = this.router.routes
  locals: any = {}


  static = this.serve.static
  formidable = (options?: formidable.Options) => this.formidableOptions = options

  initializeApplication = async (req: Request, res: Response) => {
    const serverResponse = new ServerResponse(req, res)
    const clientRequest = new ClientRequest(req, res, this.formidableOptions)

    serverResponse.initializeResponse() // initialize all property and assign it to req object
    clientRequest.initializeRequest() // initialize all property and assign it to res object

    let index = 0
    const next = async () => {
      if (index < this.routes.use.length) {
        const middleware = this.routes.use[index++]
        middleware(req, res, next)
      } else {
        const url = req.url
        if (!url) return serverResponse.notFoundReturn()
        const method = (req.method && req.method.toLowerCase() || "get") as keyof RouteType
        const exactRoute = this.routes[method].find(route => "path" in route && "handlers" in route && route.regexPath.test(url)) as Method
        if (!exactRoute) return serverResponse.notFoundReturn()
        const handlers = exactRoute.handlers as Handler[]
        await Promise.all(handlers.map(async handler => {
          req.params = clientRequest.params(exactRoute.regexPath, exactRoute.path)
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
      await this.initializeApplication(req, res)
    })

    server.listen(port, listeningListener)
  }

}
