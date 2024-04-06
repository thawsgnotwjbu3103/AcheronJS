import AcheronJS from "./libs/acheron"
const app = new AcheronJS()

app.get("/:id/test/:review", (req, res) => {
  res.json({ id: req.params.id })
})

app.post("/", (req, res) => {
  console.log(req.body)
  res.json({ id: "Hello" })
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})