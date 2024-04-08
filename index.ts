import AcheronJS from "./libs/acheron"
const app = new AcheronJS()

app.get("/:id/test/:review", (req, res) => {
  res.json({ id: req.params.id })
})

app.post("/", (req, res) => {
  res.json({body: req.body, files: req.files})
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})