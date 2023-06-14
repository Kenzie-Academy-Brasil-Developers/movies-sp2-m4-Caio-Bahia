import { Response, Request, NextFunction } from "express"
import { TMovieResult } from "./interface"
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

  if (queryResult.rowCount === 0) {
    return response.status(404).json({ error: "Movie not found" })
  }
  return next()
}

export { verifyIdExists }
