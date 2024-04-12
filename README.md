## AcheronJS - an [ExpressJS](https://expressjs.com/) clone for learning purpose


[![npm version](https://badge.fury.io/js/acheronjs.svg)](https://badge.fury.io/js/acheronjs)
[![install size](https://packagephobia.com/badge?p=acheronjs)](https://packagephobia.com/result?p=acheronjs)

## Installation
```
npm i acheronjs
```

## Quick start

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

```
MIT License

Copyright (c) 2024 Nong Duc Thang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```