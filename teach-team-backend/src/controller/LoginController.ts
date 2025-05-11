import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import bcrypt from "bcryptjs";

export class LoginController {

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async login(request: Request, response: Response) {
    try{
      const inEmail: string = request.params.email;
      const inPassword: string = request.params.password;
      const user: Users[] = await AppDataSource.manager.find(Users, {
        where: {
          email: inEmail
          }
        });

      if(user.length > 0)
        {
          return(response.json(bcrypt.compareSync(inPassword, user[0].password)));
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
