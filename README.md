## AcheronJS - an [ExpressJS](https://expressjs.com/) clone for learning purpose


[![npm version](https://badge.fury.io/js/acheronjs.svg)](https://badge.fury.io/js/acheronjs)
[![install size](https://packagephobia.com/badge?p=acheronjs)](https://packagephobia.com/result?p=acheronjs)

## Installation
```
npm i acheronjs
```

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
const app = new Acheron()

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
```