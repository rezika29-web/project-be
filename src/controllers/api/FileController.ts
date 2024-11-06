import fs from "fs"
import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import * as formidable from "formidable"
import ApiController from "../../core/ApiController"
import { badRequest, internalError, notFound } from "../../helpers/ErrorHelper"

export default class FileController extends ApiController {
  async handleDeleteOne(req: Request, res: Response) {
    /* #swagger.tags = ['File'] */
    const { id } = req.params
    const { File } = DB_PRIMARY

    let file = await File.findByPk(id)
    if (!file) file = await File.findOne({ where: { path: id } })

    if (!file) throw notFound("File not found")

    try {
      fs.unlinkSync("public/" + file.path)
    } catch (error) {
      console.log(error)
      throw internalError("Delete File failed")
    }

    await file.destroy()

    res.json({
      message: "Delete File success",
    })
  }

  async create(
    refTable: string,
    refField: string,
    title: string,
    file: any
  ) {
    const { File } = DB_PRIMARY

    const id = uuidv4()

    const fileName = file.originalFilename
    const path = `up/${id}-${fileName}`
    const mimeType = file.mimetype
    const size = file.size

    try {
      fs.copyFileSync(file.filepath, `public/${path}`)
    } catch (error) {
      console.log(error)
      throw internalError("Move File failed")
    }

    const data = await File.create({
      id,
      refTable,
      refField,
      title,
      fileName,
      path,
      mimeType,
      size,
    })

    return data
  }

  async handleCreate(req: Request, res: Response) {
    /* 
    #swagger.tags = ['File']
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["refField", "document"],
            properties: {
              refField: {
                type: "string",
              },
              title: {
                type: "string",
              },
              document: {
                type: "file",
              }
            },
          },
        },
      },
    }
    */

    const { refTable } = req.params
    const form = new formidable.IncomingForm()

    form.parse(req, async (err: any, fields: any, files: any) => {
      const refField = fields.refField[0]
      const title = fields.title[0]
      const document = files.document[0]

      // if (!refField) throw badRequest("refField required")
      // if (!document) throw badRequest("Document required")

      let file 

      try {
        file = await this.create(refTable, refField, title, document)
      }
      catch (error) {
        console.log("Upload file error")
        console.log(error)
      }

      res.status(201).json({
        message: "Create new File success",
        id: file.id,
        file,
      })
    })
  }
}
