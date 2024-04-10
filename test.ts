import AcheronJS from "./index";

const app = new AcheronJS()

app.get("/", (req, res) => {
  res.json({ok: "ok"})
})


app.listen(3000, () => {
  console.log(`Listening on port 3000`)
})