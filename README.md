## AcheronJS - an [ExpressJS](https://expressjs.com/) clone for learning purpose

[![npm version](https://badge.fury.io/js/acheronjs.svg)](https://badge.fury.io/js/acheronjs)
[![install size](https://packagephobia.com/badge?p=acheronjs)](https://packagephobia.com/result?p=acheronjs)

## Installation

```
npm i acheronjs
```

## Quick start

- Javascript

```js
const Acheron = require("acheronjs")
const app = new Acheron()

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
```

- Typescript

```ts
import AcheronJS from "acheronjs"
import { Request, Response } from "acheronjs/type"

const app = new Acheron()

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World")
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
```

## API reference

- App:

| Api                                         | Usage                                                                                                     | 
|---------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `app.use(middleware)`                       | Using middleware                                                                                          |
| `app.METHOD(path, ...handlers[])`           | Method provides the routing functionality, currently has `GET`, `POST`, `PUT`, `DELETE`, `PATCH`         |
| `app.routes`                                | Show all routes                                                                                           |
| `app.register(routerFunction)`              | Register route, see example                                                                               |
| `app.locals`                                | Same as ExpressJS's `app.locals`                                                                          |
| `app.use(app.static(prefix, rootDir))`      | Use to serve static files                                                                                 |
| `app.formidable(options)`                   | This package uses formidable to configure the response data, [see more](https://www.npmjs.com/package/formidable) |
| `app.listen(port, listeningListener)`       | Start listening on port number                                                                            |


- Request:

| Api               | Usage                                      | 
|-------------------|--------------------------------------------|
| `req.clientIp`   | Get client's IP                            |
| `req.body`       | Get request body data                      |
| `req.cookies`    | Get all request cookies                    |
| `req.query`      | Get all request query strings              |
| `req.params`     | Get all request parameters                 |


- Response:

| Api                                                     | Usage                                                                                       | 
|---------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `res.cookie(name, value, options?)`                     | Set cookie to response                                                                      |
| `res.send(body, config?)`                               | Send data to response, default is statusCode: `200`, contentType: `text/plain`             |
| `res.json(object, config?)`                             | Send data to response as JSON format, default is statusCode: `200`                          |     
| `res.internalError(body)`                               | Send 500 to response with a custom message                                                 |
| `res.render(filePath, object, config?)`                 | Send file as response, it uses [Handlebars](https://handlebarsjs.com/) as a default engine  |
| `res.notFound()`                                        | Send 404 not found to response                                                             |
| `res.set(headers)`                                      | Set multiple headers to response                                                           |
| `res.append(name, value)`                               | Append `value` to `name` header                                                            |
| `res.attachment(filename?)`                             | Same as ExpressJS's `res.attachment()`                                                      |
| `res.get(name)`                                         | Get header's value                                                                         |
| `res.sendFile(path, options, callback)`                 | Same as ExpressJS's `res.sendFile()`                                                       |
| `res.download(pathDir, filename, options, callback)`    | Same as ExpressJS's `res.download()`                                                       |
| `res.fileTransfer(file, options, callback)`             | Same as ExpressJS's `res.sendfile()`                                                       |
| `res.clearCookies(name, options)`                       | Clear response's cookies                                                                   |



## Build the project

- Clone project

```
git clone https://github.com/thawsgnotwjbu3103/AcheronJS.git
```

- Run npm install command

```
npm install
```

- Run npm run build command

```
npm run build
```

## License

[MIT](https://github.com/thawsgnotwjbu3103/AcheronJS/blob/master/LICENSE)