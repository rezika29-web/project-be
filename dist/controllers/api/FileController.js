"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const formidable = __importStar(require("formidable"));
const ApiController_1 = __importDefault(require("../../core/ApiController"));
const ErrorHelper_1 = require("../../helpers/ErrorHelper");
class FileController extends ApiController_1.default {
    handleDeleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['File'] */
            const { id } = req.params;
            const { File } = DB_PRIMARY;
            let file = yield File.findByPk(id);
            if (!file)
                file = yield File.findOne({ where: { path: id } });
            if (!file)
                throw (0, ErrorHelper_1.notFound)("File not found");
            try {
                fs_1.default.unlinkSync("public/" + file.path);
            }
            catch (error) {
                console.log(error);
                throw (0, ErrorHelper_1.internalError)("Delete File failed");
            }
            yield file.destroy();
            res.json({
                message: "Delete File success",
            });
        });
    }
    create(refTable, refField, title, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { File } = DB_PRIMARY;
            const id = (0, uuid_1.v4)();
            const fileName = file.originalFilename;
            const path = `up/${id}-${fileName}`;
            const mimeType = file.mimetype;
            const size = file.size;
            try {
                fs_1.default.copyFileSync(file.filepath, `public/${path}`);
            }
            catch (error) {
                console.log(error);
                throw (0, ErrorHelper_1.internalError)("Move File failed");
            }
            const data = yield File.create({
                id,
                refTable,
                refField,
                title,
                fileName,
                path,
                mimeType,
                size,
            });
            return data;
        });
    }
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const { refTable } = req.params;
            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
                const refField = fields.refField[0];
                const title = fields.title[0];
                const document = files.document[0];
                // if (!refField) throw badRequest("refField required")
                // if (!document) throw badRequest("Document required")
                let file;
                try {
                    file = yield this.create(refTable, refField, title, document);
                }
                catch (error) {
                    console.log("Upload file error");
                    console.log(error);
                }
                res.status(201).json({
                    message: "Create new File success",
                    id: file.id,
                    file,
                });
            }));
        });
    }
}
exports.default = FileController;
