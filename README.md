- AcheronJS - an [ExpressJS](https://expressjs.com/) clone for learning purpose

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

## [License](LICENSE)

## Build project:

```
npm run build 
```
