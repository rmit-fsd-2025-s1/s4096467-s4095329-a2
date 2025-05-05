import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";

export class UserController {

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const users = await AppDataSource.manager.find(Users, { relations: ["certifications", "educations", "languages", "previous_roles", "skills"] });

    return response.json(users);
  }
}
