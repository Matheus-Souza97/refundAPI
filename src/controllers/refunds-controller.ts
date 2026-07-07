import { Response, Request, NextFunction } from "express";

class RefundController {
  async create(request:Request, response:Response, next:NextFunction) {
    return response.status(201).json({message: "ok"})
  }
}

export { RefundController }