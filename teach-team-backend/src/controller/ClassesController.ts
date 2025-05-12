import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Classes } from "../entity/Classes";
import { Users } from "../entity/Users";

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
        const userRepo = AppDataSource.getRepository(Users);
        const class1Exist = await classRepo.findOneBy({ class_code: "ISYS3413" });
        const class2Exist = await classRepo.findOneBy({ class_code: "COSC2758" });
        const class3Exist = await classRepo.findOneBy({ class_code: "COSC2801" });
        const class4Exist = await classRepo.findOneBy({ class_code: "COSC2757" });
        const class5Exist = await classRepo.findOneBy({ class_code: "ISYS1102" });
        const class6Exist = await classRepo.findOneBy({ class_code: "COSC3046" });
        const user1Lectures = await classRepo
          .createQueryBuilder("classes")
          .leftJoin("classes.lecturers", "lecturer")
          .where("lecturer.email = 'connor@gmail.com'")
          .getOne();

        const user2Lectures = await classRepo
          .createQueryBuilder("classes")
          .leftJoin("classes.lecturers", "lecturer")
          .where("lecturer.email = 'will@gmail.com'")
          .getOne();
  
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

        if(!user1Lectures)
          {
            const user1 = await userRepo.findOneBy({ email: "connor@gmail.com" });
            const class1 = await classRepo.findOneBy({ class_code: "COSC2757" });
            const class2 = await classRepo.findOneBy({ class_code: "COSC2758" });
            const class3 = await classRepo.findOneBy({ class_code: "COSC2801" });

            class1.lecturers = [];
            class1.lecturers.push(user1);
          await classRepo.save(class1);
            class2.lecturers = [];
            class2.lecturers.push(user1);
          await classRepo.save(class2);
            class3.lecturers = [];
            class3.lecturers.push(user1);
          await classRepo.save(class3);
          }

        if(!user2Lectures)
          {
            const user2 = await userRepo.findOneBy({ email: "will@gmail.com" });
            const class1 = await classRepo.findOneBy({ class_code: "COSC3046" });
            const class2 = await classRepo.findOneBy({ class_code: "ISYS1102" });
            const class3 = await classRepo.findOneBy({ class_code: "ISYS3413" });

            class1.lecturers = [];
            class1.lecturers.push(user2);
          await classRepo.save(class1);
            class2.lecturers = [];
            class2.lecturers.push(user2);
          await classRepo.save(class2);
            class3.lecturers = [];
            class3.lecturers.push(user2);
          await classRepo.save(class3);
          }
      }
      catch(e)
      {
        console.log(e);
      }
    }    
}
