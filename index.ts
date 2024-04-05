import AcheronJS from "./libs/acheron"

const app = new AcheronJS()

app.get("/", (req, res) => {
  res.json({ text: "Hello World" })
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})