import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { authConfig } from "../configs/auth";
import { sign } from "jsonwebtoken";
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

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn: "1d"
    })

    const { password:_, ...userWithoutPassword } = user

    return response.status(201).json({token, user:userWithoutPassword})
  }
}

export { SessionsController }