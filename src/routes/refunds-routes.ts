import { Router } from "express";
import { RefundController } from "../controllers/refunds-controller";
import { verifyUserAuthorization } from "../middlewares/verify-user-authorization";

const refundRoutes = Router()
const refundController = new RefundController()

refundRoutes.post("/",verifyUserAuthorization(["employee", "manager"]), refundController.create)
refundRoutes.get("/", verifyUserAuthorization(["manager"]), refundController.index)
refundRoutes.get("/:id", verifyUserAuthorization(["employee", "manager"]), refundController.show)

export { refundRoutes }