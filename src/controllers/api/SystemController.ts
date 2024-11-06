import { Request, Response } from 'express'
import config from '../../config/AllConfig'
import ApiController from '../../core/ApiController'

export default class SystemController extends ApiController {

  actionEnvy(req: Request, res: Response) {
    /* #swagger.tags = ['System'] */

    for (const key of Object.keys(config.envy)) {
      // @ts-ignore
      this.warning(`${key}: ${config.envy[key]}`)
    }
    
    res.json(config.envy)
  }

}