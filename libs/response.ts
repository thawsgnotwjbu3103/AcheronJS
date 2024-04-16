import { Request, Response, ResponseConfig, Headers, ContentTypeKey, Callback, Options } from "./type"
import { CONTENT_TYPE } from "./constant"
import * as fs from "fs"
import * as hbs from "handlebars"
import { CookieSerializeOptions } from "cookie"
import * as cookie from "cookie"
import * as path from "path"
import onFinished from "on-finished"
import contentDisposition from "content-disposition"
import send, { SendStream } from "send"
import Utils from "./utils"

export default class ServerResponse {
  private _res: Response
  private _req: Request
  private utils = new Utils()

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

  cookie = (name: string, value: string, options?: CookieSerializeOptions) => {
    cookie.serialize(name, value, options)
  }

  set = (headers: Headers) => {
    for (const [key, value] of Object.entries(headers)) {
      this._res.setHeader(key, value || "")
    }
  }

  append = (name: string, value: string) => {
    this._res.setHeader(name.toLowerCase(), value)
  }

  get = (name: string) => {
    return this._res.getHeader(name.toLowerCase())
  }

  attachment = (filename: string | undefined) => {
    if (filename) {
      const key = path.extname(filename) as ContentTypeKey
      this._res.append("Content-Type", CONTENT_TYPE[key])
    }
    this._res.append("Content-Disposition", contentDisposition(filename))
    return
  }

  clearCookie = (name: string, options: CookieSerializeOptions) => {
    cookie.serialize(name, "", { ...options, expires: options.expires || new Date(1), path: options.path || "/" })
  }

  sendFile = (path: string | undefined, options: Options | null, callback: Callback | undefined) => {
    let done = callback
    let opts = options || {}

    if (!path) {
      throw new TypeError("path argument is required to res.sendFile")
    }

    if (opts && !("root" in opts) && !this.utils.isAbsolute(path)) {
      throw new TypeError("path must be absolute or specify root to res.sendFile")
    }

    let pathname = encodeURI(path)
    const file = send(this._req, pathname, opts)

    this.fileTransfer(file, opts, (err) => {
      if (done) return done(err, null)
      if (err && err.code === "EISDIR") return
      if (err && err.code === "ECONNABORTED" && err.syscall !== "write") throw new TypeError(err.message)
    })
  }

  fileTransfer = (file: SendStream, opts: Options | {}, callback: Callback) => {
    let done = false
    let streaming = true

    const onAborted = () => {
      if (done) return
      done = true
      let err = { message: "Request aborted", name: "Request aborted", code: "ECONNABORTED" }
      callback(err, null)
    }

    const onDirectory = () => {
      if (done) return
      let err = { message: "EISDIR, read", name: "EISDIR, read", code: "EISDIR" }
      callback(err, null)
    }

    const onError = (err: NodeJS.ErrnoException) => {
      if (done) return
      done = true
      callback(err, null)
    }

    const onEnd = () => {
      if (done) return
      done = true
      callback(null, null)
    }

    const onFile = () => {
      streaming = false
    }

    const onFinish = (err: NodeJS.ErrnoException | null) => {
      if (err && err.code === "ECONNRESET") return onAborted()
      if (err) return onError(err)
      if (done) return

      setImmediate(() => {
        if (streaming && !done) return onAborted()
        if (done) return
        done = true
        callback(null, null)
      })

    }

    const onStream = () => {
      streaming = true
    }

    file.on("directory", onDirectory)
    file.on("end", onEnd)
    file.on("error", onError)
    file.on("file", onFile)
    file.on("stream", onStream)
    onFinished(this._res, onFinish)

    if (opts && "headers" in opts) {
      file.on("headers", (res) => {
        const obj = opts.headers
        for (const [key, value] of Object.entries(obj)) {
          console.log(key, value)
          if (value) this._res.setHeader(key, value)
        }
      })
    }

    file.pipe(this._res)
  }

  download = (pathDir: string, filename: string | null, options: Options | null, callback: Callback) => {
    let headers: Headers = {
      "Content-Disposition": contentDisposition(filename || pathDir)
    }

    if (options && options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        if (value) headers[key] = value
      }
    }

    let opts = Object.create(options)
    opts.headers = headers

    let fullPath = !opts.root ? path.resolve(pathDir) : pathDir
    return this.sendFile(fullPath, opts, callback)
  }

  initializeResponse = () => {
    this._res.cookie = this.cookie
    this._res.send = this.sendReturn
    this._res.json = this.jsonReturn
    this._res.internalError = this.internalErrorReturn
    this._res.render = this.renderReturn
    this._res.notFound = this.notFoundReturn
    this._res.set = this.set
    this._res.append = this.append
    this._res.get = this.get
    this._res.attachment = this.attachment
    this._res.sendFile = this.sendFile
    this._res.download = this.download
    this._res.fileTransfer = this.fileTransfer
    this._res.clearCookie = this.clearCookie
  }

}