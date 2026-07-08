import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { refundRoutes } from "./refunds-routes";
import { uploadsRoutes } from "./uploads-rotes";


const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)

routes.use(ensureAuthenticated)
routes.use("/refunds", refundRoutes )
routes.use("/uploads", uploadsRoutes)

export { routes }