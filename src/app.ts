import express from "express"
import cors from "cors"
import { errorHandling } from "./middlewares/error-handling"
import { AppError } from "./utils/AppError"

const app = express()

app.use(express.json())
app.use(cors())

app.use(errorHandling)
  

export { app }