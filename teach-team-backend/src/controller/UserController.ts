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

  // Fills sample users if they are missing
  async fillUsers()
  {
    try
    {
      const userRepo = AppDataSource.getRepository(Users);
      const user1Exist = await userRepo.findOneBy({ email: "test1@gmail.com" });
      const user2Exist = await userRepo.findOneBy({ email: "test2@gmail.com" });
      const user3Exist = await userRepo.findOneBy({ email: "test3@gmail.com" });

      if(!user1Exist)
        {
          await userRepo
          .save([
            {
              email: "test1@gmail.com",
              full_name: "Robert",
              password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
              role: "candidate",
              availability: "weekdays",
              summary: "Hi I am robert, I study aerospace engineering",
              certifications: [{certification: "Bachelors Degree in aerospace engineering"}],
              educations: [{education: "University of Melbourne"}],
              languages: [{language: "English"}, {language: "Spanish"}],
              previous_roles: [{prev_role: "Intern at tesla for 1 year"}],
              skills: [{skill: "Adaptable"}],
            }
          ]);
        }

      if(!user2Exist)
        {
          await userRepo
          .save([
            {
              email: "test2@gmail.com",
              full_name: "Dorothy",
              password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
              role: "candidate",
              availability: "part-time",
              summary: "I am Dorothy I am 20 years old",
              certifications: [{certification: "Bachelors Degree in Education"}],
              educations: [{education: "University of Victoria"}],
              languages: [{language: "English"}],
              previous_roles: [{prev_role: "None"}],
              skills: [{skill: "Hard-Working"}],
            }
          ]);
        }

      if(!user3Exist)
        {
          await userRepo
          .save([
            {
              email: "test3@gmail.com",
              full_name: "Frank",
              password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
              role: "candidate",
              availability: "full-time",
              summary: "Hello, I am Frank, I like programming",
              certifications: [{certification: "Masters Degress in computer science"}],
              educations: [{education: "RMIT"}],
              languages: [{language: "English"}, {language: "C++"}, {language: "Chinese"}],
              previous_roles: [{prev_role: "Intern at Microsoft"}],
              skills: [{skill: "God at Leetcode"}],
            }
          ]);
        }
    }
    catch(e)
    {
      console.log(e);
    }
  }
}
