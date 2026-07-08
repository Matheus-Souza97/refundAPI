import fs from "node:fs"
import path from "node:path"

import uploadConfig from "../configs/upload"

class DiskStorage {
  async salveFile(file: string) {
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file)
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    try {
      await fs.promises.access(tmpPath)
    } catch (error) {
      console.log(error)
      throw new Error(`Arquivo não encontrado: ${tmpPath}`)
    }

    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true })//garante que a pasta existe
    await fs.promises.rename(tmpPath, destPath)//move o arquivo de logar

    return file
  }

  async deleteFile(file: string, type: "tmp" | "upload") {
    const pathFile = type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

    const filePath = path.resolve(pathFile, file)

    try {
      await fs.promises.stat(filePath)//verifica o status do arquivo, se esta disponivel ou não
    } catch {
      return
    }

    await fs.promises.unlink(filePath) // deleta o arquivo
  }
}

export { DiskStorage }