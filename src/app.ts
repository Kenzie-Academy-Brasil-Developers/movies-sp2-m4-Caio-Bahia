import express, { Application, json } from "express"
import "dotenv/config"
import { connectDB } from "./database"
import { createMovie, deleteMovie, readMovie, readMovieById, updateMovie } from "./logic"
import { verifyIdExists, verifyNameExists } from "./middleware"

const app: Application = express()
app.use(json())

app.post("/movies", verifyNameExists, createMovie)
app.get("/movies", readMovie)

app.get("/movies/:id", verifyIdExists, readMovieById)

app.patch("/movies/:id", verifyIdExists, updateMovie)
app.delete("/movies/:id", verifyIdExists, deleteMovie)

const svMsg: string = "Server is running."

app.listen(process.env.PORT, async () => {
  await connectDB()
  console.log(svMsg)
})
