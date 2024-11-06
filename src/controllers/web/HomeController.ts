import { Request, Response } from "express"
import WebController from "../../core/WebController"

export default class HomeController extends WebController {
  constructor() {
    super()
    this.metadata = {
      title: "Home",
    }
  }

  async handleIndex(req: Request, res: Response) {
    this.render(res, {
      description:
        "Classic MVC boilerplate based on ExpressJS, TypeScript & Sequelize.",
    })
  }
}
