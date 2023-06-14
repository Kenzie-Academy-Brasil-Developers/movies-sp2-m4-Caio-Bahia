import { Request, Response, response } from "express"
import { IMovie, TMovieResult, TMovieUpdateRequest } from "./interface"
import format from "pg-format"
import { Client } from "pg"
import { client } from "./database"

const createMovie = async (request: Request, response: Response): Promise<Response> => {
  const payload: IMovie = request.body

  const queryString: string = format(
    `
    INSERT INTO movies (%I)
    VALUES (%L)
    RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  )
  const queryResult: TMovieResult = await client.query(queryString)

  return response.status(201).json(queryResult.rows[0])
}
const readMovie = async (request: Request, response: Response): Promise<Response> => {
  const queryStringCategory: string = `
    SELECT * FROM movies
    WHERE category = $1;
    `
  const queryResultCategory: TMovieResult = await client.query(queryStringCategory, [
    request.query.category
  ])

  if (queryResultCategory.rowCount > 0) {
    return response.status(200).json(queryResultCategory.rows)
  }
  const queryStringAll: string = `
    SELECT * FROM movies;
    `
  const queryResultAll: TMovieResult = await client.query(queryStringAll)

  return response.json(queryResultAll.rows)
}
const updateMovie = async (request: Request, response: Response): Promise<Response> => {
  const payload: TMovieUpdateRequest = request.body

  const queryString: string = format(
    `
    UPDATE movies
    SET(%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  )
  const queryResult: TMovieResult = await client.query(queryString, [request.params.id])

  return response.status(200).json(queryResult.rows[0])
}

const deleteMovie = async (request: Request, response: Response): Promise<Response> => {
  const queryString: string = `
    DELETE FROM movies
    WHERE id=$1; 
    `
  await client.query(queryString, [request.params.id])
  return response.status(204).send()
}

export { createMovie, readMovie, updateMovie, deleteMovie }
