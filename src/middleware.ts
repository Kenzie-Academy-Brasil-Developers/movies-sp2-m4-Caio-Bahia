import { Response, Request, NextFunction } from "express"
import { IMovie, TMovieResult } from "./interface"
import { client } from "./database"

const verifyIdExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const queryString: string = `
    SELECT * FROM movies
    WHERE id=$1;
`
  const queryResult: TMovieResult = await client.query(queryString, [request.params.id])

  response.locals = {
    ...response.locals,
    getMovie: queryResult.rows
  }

  if (queryResult.rowCount === 0) {
    return response.status(404).json({ error: "Movie not found!" })
  }
  return next()
}
const verifyNameExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { name } = request.body

  const queryString: TMovieResult = await client.query(
    `
    SELECT * FROM movies
    WHERE name=$1;

`,
    [name]
  )

  if (queryString.rowCount > 0) {
    return response.status(409).json({ error: "Movie already exists" })
  }
  return next()
}
export { verifyIdExists, verifyNameExists }
