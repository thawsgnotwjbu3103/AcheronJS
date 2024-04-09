import { ContentTypeKey, Request, Response } from "./type"
import path from "path"
import { CONTENT_TYPE } from "./constant"
import fs from "fs"

export default class Static {
  static = (prefix: string, rootDir: string) => {
    return (req: Request, res: Response, next: () => void) => {
      if (req.url && req.url.includes(prefix)) {
        const fileName = req.url.replace(new RegExp(`\/?${prefix}`, "g"), "")
        const filePath = path.join(rootDir, fileName)
        const extname = path.extname(filePath) as ContentTypeKey
        const contentType = CONTENT_TYPE[extname]
        if (!contentType) {
          res.internalError("File not allowed or not found")
          return
        }
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.internalError("Internal Server Error")
            return
          }
          res.send(data, { contentType: contentType, statusCode: 200 })
          return
        })
      } else {
        next()
      }
    }
  }
}