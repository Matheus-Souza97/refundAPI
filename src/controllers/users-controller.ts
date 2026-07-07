import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { z } from "zod";
import { hash } from "bcrypt";

class UsersController {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(3, "O nome deve conter no minimo 3 caracteres").max(200),
      email: z.string().trim().email("E-mail invalido").max(150).toLowerCase(),
      password: z.string().min(6, "A senha deve conter no minimo 6 caracteres "),
      role: z.enum(["employee","manager"]).default("employee")
    })

    const { name, email, password, role} = bodySchema.parse(request.body)

    const validateUniqueEmail = await prisma.user.findFirst({where: { email }})

    if(validateUniqueEmail) {
      throw new AppError("Já existe um usuario cadastrado com esse e-mail", 401)
    }

    const hashedPassword = await hash(password, 8)
    

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password:hashedPassword,
        role
      }
    })


    return response.status(201).json(user)
  }
}

export { UsersController }