import { Response, Request, NextFunction } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { z } from "zod"

const CategoriesEnum = z.enum(["food", "others", "services", "transport", "accommodation"])

class RefundController {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, "Informe o nome da solicitacão"),
      category: CategoriesEnum,
      amount: z.number().positive("O valor deve ser positivo"),
      filename: z.string().min(20)
    })

    const { name, category, amount, filename } = bodySchema.parse(request.body)

    if(!request.user?.id) {
      throw new AppError("Unauthorized", 401)
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id
      }
    })

    return response.status(201).json(refund)
  }

  async show(request:Request, response:Response, next:NextFunction) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    })

    const { name, page, perPage } = querySchema.parse(request.query)

    //CALCULANDO O NUMERO DE PAGINAS

    const skip = (page - 1) * perPage

    const refund = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim()
          }
        }
      },
      orderBy: { createdAt: "desc"},
      include: { user:true }
    })

    //OBTER TOTAL DE REGISTROS PARA CALACULAR O NUMERO DE PAGINAS

    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim()
          }
        }
      }})

      const totalPages = Math.ceil(totalRecords / perPage)

    return response.status(200).json({refund, pagination: {page, perPage, totalRecords, totalPages: totalPages > 0 ? totalPages : 1}})
  }
}

export { RefundController }