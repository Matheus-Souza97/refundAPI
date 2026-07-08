import { Request, Response } from "express";
import { z, ZodError } from "zod"

import uploadConfig from "../configs/upload"
import { DiskStorage } from "../providers/disk-storage";
import { AppError } from "../utils/AppError";

class UploadsController {
  async create(request:Request, response:Response) {
    const diskStorage = new DiskStorage()

  try {
    const fileSchema = z.object({
      filename: z.string().min(1, "Arquivo é obrigratorio"),
      mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_IMG_TYPES.includes(type), `Formato de arquivo invalido. Formatos permitidos: ${uploadConfig.ACCEPTED_IMG_TYPES}`),
      size: z.number().positive().refine((size) => size <= uploadConfig.MAX_FILE_SIZE, `Arquivo excede o tamanho maximo de ${uploadConfig.MAX_SIZE}`) 
    }).passthrough()

    const file = fileSchema.parse(request.file)
    const filename = await diskStorage.salveFile(file.filename)

    response.json({ filename })
    
  } catch (error) {
    if(error instanceof ZodError) {
      if(request.file) {
        await diskStorage.deleteFile(request.file.filename, "tmp")
      }

      throw new AppError(error.issues[0].message)
    }
    throw error
  }
    return response.status(201).json({file: request.file})
  }
}

export { UploadsController }