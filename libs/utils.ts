import { Request } from "./type"
import * as qs from "querystring"
import formidable from "formidable"

export default class Utils {

  getParams = (req: Request, pathRegex: RegExp, path: string) => {
    if (!req.url) return {}
    const matchName = pathRegex.exec(path)
    const matchValue = pathRegex.exec(req.url)
    if (!matchName || !matchValue) return {}
    const obj: any = {}
    matchName.splice(0, 1)
    matchValue.splice(0, 1)
    for (let i = 0; i < matchValue.length; i++) {
      const propertyName = matchName[i].replace(":", "")
      obj[propertyName] = matchValue[i]
    }
    return obj
  }

  getQuery = (req: Request) => {
    if (!req.url) return {}
    const url = req.url.split("?")[1]
    if (!url) return {}
    return qs.parse(url)
  }

  getBody = async (req: Request, options?: formidable.Options) => {
    const form = formidable(options)
    const result = {
      file: {},
      body: {}
    }
    try {
      const [fields, files] = await form.parse(req)
      const body: any = {}
      const file: any = {}
      for (let [key, value] of Object.entries(fields)) {
        if (value) {
          if (value.length > 1) {
            body[key] = value
          } else if (value.length == 1) {
            body[key] = value[0]
          } else {
            body[key] = undefined
          }
        } else {
          body[key] = undefined
        }
      }

      for (let [key, value] of Object.entries(files)) {
        if (value) {
          if (value.length > 1) {
            file[key] = value
          } else if (value.length === 1) {
            file[key] = value[0]
          } else {
            file[key] = undefined
          }
        } else {
          file[key] = undefined
        }
      }

      result.body = body
      result.file = file
    } catch (err) {
      console.error(err)
    }

    return result
  }

  isAbsolute = (path: string) => {
    if ('/' === path[0]) return true;
    if (':' === path[1] && ('\\' === path[2] || '/' === path[2])) return true; // Windows device path
    if ('\\\\' === path.substring(0, 2)) return true; // Microsoft Azure absolute path
  }
}

