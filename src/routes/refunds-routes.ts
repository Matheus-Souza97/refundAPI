import { Router } from "express";
import { RefundController } from "../controllers/refunds-controller";

const refundRoutes = Router()
const refundController = new RefundController()

refundRoutes.post("/", refundController.create)

export { refundRoutes }