import { RouterHandler } from "../libs/type"

export default (routes: RouterHandler) => {
  routes.get("/home", (req, res) => {
    res.send("Home page")
  })
}