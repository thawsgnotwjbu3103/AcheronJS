import { Request } from "./type"
import * as qs from "querystring"

export const getParams = (req: Request, pathRegex: RegExp, path: string) => {
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

export const getQuery = (req: Request) => {
  if (!req.url) return {}
  const url = req.url.split("?")[1]
  if (!url) return {}
  return qs.parse(url)
}

export const getBody = (req: Request) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const formData = qs.parse(body);
    console.log(formData);
  });
  return {}
}