import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { compare } from "bcrypt";
import { z } from "zod"

class SessionsController {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      email: z.string().email("E-mail ou senha invalido"),
      password: z.string()
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({where: {email}})
    if(!user) {
      throw new AppError("E-mail ou senha invalido",401)
    }

    const passwordMatched = await compare(password, user.password)
    if(!passwordMatched) {
      throw new AppError("E-mail ou senha invalido",401)
    }

    return response.status(201).json({message: "ok"})
  }
}

export { SessionsController }