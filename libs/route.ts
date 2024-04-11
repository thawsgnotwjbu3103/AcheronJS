import { Handler, MethodHandler, RouterHandler, RouteType } from "./type"
import { REGEX_PARAMS_ROUTE } from "./constant"

export default class Route {
  routes: RouteType = {
    get: [],
    delete: [],
    patch: [],
    post: [],
    put: [],
    use: []
  }

  get = (path: string, ...handlers: Handler[]) => {
    this.routes.get.push({
      path,
      handlers,
      regexPath: new RegExp(`^${path.replace(REGEX_PARAMS_ROUTE, "([^\\/]+)")}$`)
    })
  }

  delete = (path: string, ...handlers: Handler[]) => {
    this.routes.delete.push({
      path,
      handlers,
      regexPath: new RegExp(`^${path.replace(REGEX_PARAMS_ROUTE, "([^\\/]+)")}$`)
    })
  }

  patch = (path: string, ...handlers: Handler[]) => {
    this.routes.patch.push({
      path,
      handlers,
      regexPath: new RegExp(`^${path.replace(REGEX_PARAMS_ROUTE, "([^\\/]+)")}$`)
    })
  }

  post = (path: string, ...handlers: Handler[]) => {
    this.routes.post.push({
      path,
      handlers,
      regexPath: new RegExp(`^${path.replace(REGEX_PARAMS_ROUTE, "([^\\/]+)")}$`)
    })
  }

  put = (path: string, ...handlers: Handler[]) => {
    this.routes.put.push({
      path,
      handlers,
      regexPath: new RegExp(`^${path.replace(REGEX_PARAMS_ROUTE, "([^\\/]+)")}$`)
    })
  }

  use = (middleware: Handler) => {
    this.routes.use.push(middleware)
  }

  register = (routerFunction: (r: RouterHandler) => void) => {
    routerFunction({
      get: this.get,
      post: this.post,
      patch: this.patch,
      delete: this.delete,
      put: this.put
    })
  }
}