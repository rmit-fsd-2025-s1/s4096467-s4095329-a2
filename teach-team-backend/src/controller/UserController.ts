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
    try
    {
      const users: Users[] = await AppDataSource.manager.find(Users);
  
      return response.json(users);
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json([]);
    }
  }

  async userType(request: Request, response: Response) {
    try{
      const inEmail: string = request.params.email;
      const user: Users[] = await AppDataSource.manager.find(Users, {
        where: {
          email: inEmail
          },
        take: 1
        });

      if(user.length > 0)
          {
            return(response.json(user[0].role));
          }
          else
          {
            return(response.json(false));
          }
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json(false);
    }
  }
}
