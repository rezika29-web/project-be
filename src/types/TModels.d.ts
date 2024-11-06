import { UserModel } from "../models/UserModel"
import { RoleModel } from "../models/RoleModel"
import { FileModel } from "../models/FileModel"
import { MailModel } from "../models/MailModel"
import { PerusahaanModel } from "../models/PerusahaanModel"
import { BlokModel } from "../models/BlokModel"
import { KolamModel } from "../models/KolamModel"
import { AnalisaKolamModel } from "../models/AnalisaKolamModel"
import { JenisPlanktonModel } from "../models/JenisPlanktonModel"

interface TModels {
  User: typeof UserModel
  Role: typeof RoleModel
  File: typeof FileModel
}
