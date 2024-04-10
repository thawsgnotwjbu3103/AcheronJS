import * as http from "http"
import formidable from "formidable"

import { DEFAULT_MAX_FILE_SIZE, DEFAULT_PORT } from "./constant"
import { Handler, Method, Request, Response, ResponseConfig, RouteType } from "./type"
import Route from "./route"
import Static from "./static"
import ServerResponse from "./response"
import ClientRequest from "./request"


export default class AcheronJS {

  private r = new Route() // call Route class
  private s = new Static() // call Static class

  // Options for body data
  private formidableOptions: formidable.Options | undefined = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE // set default size for uploaded file is 128MB
  }

  use = this.r.use // "use" middleware
  get = this.r.get // GET method
  delete = this.r.delete // DELETE method
  patch = this.r.patch // PATCH method
  post = this.r.post // POST method
  put = this.r.put // PUT method
  routes = this.r.routes // routes array

  static = this.s.static // serve static files function

  // function for setting req.body | req.files
  formidable = (options?: formidable.Options) => this.formidableOptions = options

  // initialize function
  initialize = async (req: Request, res: Response) => {
    const rr = new ServerResponse(req, res) // call ServerResponse class
    const cr = new ClientRequest(req, res) // call ClientRequest class
    const { body, file } = await cr.bodyParser(this.formidableOptions) // get request data

    req.clientIp = cr.getClientIp() // assign req.clientIp
    req.query = cr.query() // assign req.query
    req.body = body // assign req.body
    req.files = file // assign req.files
    req.cookies = cr.cookies() // get request cookies

    // assign res.notFound
    res.notFound = () => rr.notFoundReturn()

    // assign res.internalError
    res.internalError = (body: any) => rr.internalErrorReturn(body)

    /*
    assign res.render - default value is: {
      statusCode: 200
      encoding: utf-8
      contentType: application/json
     }
    */
    res.json = (object: any, config: ResponseConfig | undefined = {}) => rr.jsonReturn(object, config)

    /*
    assign res.render - default value is: {
      statusCode: 200
      encoding: utf-8
      contentType: text/plain
     }
   */
    res.send = (body: any, config: ResponseConfig | undefined = {}) => rr.sendReturn(body, config)

    /*
    assign res.render - default value is: {
      statusCode: 200
      encoding: utf-8
       contentType: text/html
     }
   */
    res.render = (filePath: string, object: any, config: ResponseConfig | undefined = {}) => rr.renderReturn(filePath, object, config)

    // Set cookies function
    res.cookie = rr.cookie

    // NextFunction like expressjs
    let index = 0
    const next = async () => {
      if (index < this.routes.use.length) {
        const middleware = this.routes.use[index++]
        middleware(req, res, next)
      } else {
        const url = req.url
        if (!url) return rr.notFoundReturn()

        // get method name - default is GET
        const method = (req.method && req.method.toLowerCase() || "get") as keyof RouteType

        // find the exact route
        const exactRoute = this.routes[method].find(route => "path" in route && "handlers" in route && route.regexPath.test(url)) as Method
        if (!exactRoute) return rr.notFoundReturn()

        // begin to assign values to found route
        const handlers = exactRoute.handlers as Handler[]
        await Promise.all(handlers.map(async handler => {
          req.params = cr.params(exactRoute.regexPath, exactRoute.path) // assign req.params
          await handler(req, res, next) // assign handler
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
