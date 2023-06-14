import express, { Application, json } from "express"
import "dotenv/config"
import { connectDB } from "./database"
import { createMovie, deleteMovie, readMovie, updateMovie } from "./logic"

const app: Application = express()
app.use(json())

app.post("/movies", createMovie)
app.get("/movies", readMovie)
app.patch("/movies/:id", updateMovie)
app.delete("/movies/:id", deleteMovie)

const svMsg: string = "Server is running."

app.listen(process.env.PORT, async () => {
  await connectDB()
  console.log(svMsg)
})
