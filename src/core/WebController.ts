import { Response } from "express"
import CoreController from "./CoreController"

export default class WebController extends CoreController {
  async render(res: Response, data: Object) {
    res.render("HomePage", {
      ...this.defaultMetadata,
      ...this.metadata,
      ...data,
    })
  }
}
