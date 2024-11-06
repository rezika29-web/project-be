import CoreController from "./CoreController"

export default class ApiController extends CoreController {
  async warning(message: any) {
    console.log(`\x1b[33m${message}\x1b[0m`)
  }
}
