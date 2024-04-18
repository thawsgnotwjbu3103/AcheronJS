import AcheronJS from "../libs/acheron"
import routing from "./routing"

const app = new AcheronJS()

app.register(routing)

app.get("/", (req, res) => {
  res.download("hello.txt", null ,null, () => {})
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})