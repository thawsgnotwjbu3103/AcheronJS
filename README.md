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

  | Api | Usage                                                                                                                | 
    -----|----------------------------------------------------------------------------------------------------------------------
  | ```app.use(middleware)``` | Using middleware                                                                                                     |
  | ```app.METHOD(path, ...handlers[])```| Method provides the routing functionality, currently has ```GET```, ```POST```, ```PUT```, ```DELETE```, ```PATCH``` 
  | ```app.routes``` | Show all routes                                                                                                      |     
  | ```app.register(routerFunction)``` | Register route, see example
  | ```app.locals``` | Same as ExpressJS
  | ```app.use(app.static(prefix, rootDir))``` | Use to serve static files
  | ```app.formidable(options)```| This package use formidable to configure the response data, [see more](https://www.npmjs.com/package/formidable)
  | ```app.listen(port, listeningListener)``` | Start listening on port number
  

- Request:
- Response:
- Route

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