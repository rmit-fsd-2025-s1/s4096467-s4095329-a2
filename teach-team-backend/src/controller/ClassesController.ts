import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Classes } from "../entity/Classes";

export class ClassesController {

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    try
    {
      const classes: Classes[] = await AppDataSource.manager.find(Classes);
  
      return response.json(classes);
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json([]);
    }
  }

  // Fills sample classes if they are missing
    async fillClasses()
    {
      try
      {
        const classRepo = AppDataSource.getRepository(Classes);
        const class1Exist = await classRepo.findOneBy({ class_code: "ISYS3413" });
        const class2Exist = await classRepo.findOneBy({ class_code: "COSC2758" });
        const class3Exist = await classRepo.findOneBy({ class_code: "COSC2801" });
        const class4Exist = await classRepo.findOneBy({ class_code: "COSC2757" });
        const class5Exist = await classRepo.findOneBy({ class_code: "ISYS1102" });
        const class6Exist = await classRepo.findOneBy({ class_code: "COSC3046" });
  
        if(!class1Exist)
          {
            await classRepo
            .save([
              {
                class_code: "ISYS3413",
                subject_name: "Software Engineering Fundamentals for IT",
              }
            ]);
          }

        if(!class2Exist)
          {
            await classRepo
            .save([
              {
                class_code: "COSC2758",
                subject_name: "Full Stack Development",
              }
            ]);
          }

        if(!class3Exist)
          {
            await classRepo
            .save([
              {
                class_code: "COSC2801",
                subject_name: "Programming Bootcamp 1",
              }
            ]);
          }

        if(!class4Exist)
          {
            await classRepo
            .save([
              {
                class_code: "COSC2757",
                subject_name: "Cloud Foundations",
              }
            ]);
          }

        if(!class5Exist)
          {
            await classRepo
            .save([
              {
                class_code: "ISYS1102",
                subject_name: "Database Applications",
              }
            ]);
          }

        if(!class6Exist)
          {
            await classRepo
            .save([
              {
                class_code: "COSC3046",
                subject_name: "Web Programming Studio",
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
