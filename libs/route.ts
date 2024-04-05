import { Handler, IRoute } from "./type"

export default class Route {
  routes: IRoute = {
    get: [],
    delete: [],
    patch: [],
    post: [],
    put: [],
    use: []
  }

  get = (path: string, ...handlers: Handler[]) => {
    this.routes.get.push({ path, handlers, regexPath: new RegExp(`^${path.replace(/:\w+/g, "([^\\/]+)")}$`) })
  }

  delete = (path: string, ...handlers: Handler[]) => {
    this.routes.delete.push({ path, handlers, regexPath: new RegExp(`^${path.replace(/:\w+/g, "([^\\/]+)")}$`) })
  }

  patch = (path: string, ...handlers: Handler[]) => {
    this.routes.patch.push({ path, handlers, regexPath: new RegExp(`^${path.replace(/:\w+/g, "([^\\/]+)")}$`) })
  }

  post = (path: string, ...handlers: Handler[]) => {
    this.routes.post.push({ path, handlers, regexPath: new RegExp(`^${path.replace(/:\w+/g, "([^\\/]+)")}$`) })
  }

  put = (path: string, ...handlers: Handler[]) => {
    this.routes.put.push({ path, handlers, regexPath: new RegExp(`^${path.replace(/:\w+/g, "([^\\/]+)")}$`) })
  }

  use = (middleware: Handler) => {
    this.routes.use.push(middleware)
  }
}