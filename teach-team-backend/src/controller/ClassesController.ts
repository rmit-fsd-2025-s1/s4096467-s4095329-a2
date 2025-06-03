import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Classes } from "../entity/Classes";
import { Users } from "../entity/Users";
import { Tutors } from "../entity/Tutors";
import { emit } from "process";

interface clientUsers{
  email: string,
  full_name: string,
  password: string,
  role: string,
  availability: string,
  summary: string,
  active: boolean,
  certifications: string[],
  educations: string[],
  languages: string[],
  previous_roles: string[],
  skills: string[]
}

interface userSearchResults{
  person: clientUsers;
  applied: classSearchResults[],
  accepted: classSearchResults[],
  timesAccepted: number
}

interface classSearchResults{
  courseCode: string,
  courseName: string,
  tutorStatus: boolean,
  labStatus: boolean
}

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

  async addApplicant(request: Request, response: Response) {
    try
    {
      const inEmail: string = request.body.email;
      const inSubject: string = request.body.subject;
      const inRole: string = request.body.role;

      const dbUser = await AppDataSource.getRepository(Users).findOneBy({email: inEmail});
      const dbTutor = await AppDataSource.getRepository(Tutors).findOneBy({email: inEmail, class_code: inSubject, role_name: inRole});
      const dbSubject = await AppDataSource.getRepository(Classes).findOneBy({class_code: inSubject});
      let validRole: boolean = false;

      if((inRole === "tutor")||(inRole === "lab_assistant"))
        {
          validRole = true;
        }

      if (dbUser && !dbTutor && dbSubject)
      {
        AppDataSource.getRepository(Tutors).save([
          {
            email: inEmail,
            class_code: inSubject,
            role_name: inRole
          }

        ]);
        return response.status(201).json(true);
      }
      else
      {
        return response.status(409).json(false)
      }
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json(false);
    }
  }

  async updateClass(request: Request, response: Response) {
    // This should override the existing entries in the database using a transaction, this is
    // due to Matt telling us that this problem is really hard to handle and is out of the
    // scope of this assignment.
    try
    {
      //Get values for class details 
      const tutApplicants: Tutors[] = request.body.classInfo.tutorApplicants;
      const tutAccepted: Tutors[] = request.body.classInfo.tutorAccepted;
      const labApplicants: Tutors[] = request.body.classInfo.labApplicants;
      const labAccepted: Tutors[] = request.body.classInfo.labAccepted;

      // const dbUser = await AppDataSource.getRepository(Users).findOneBy({email: inEmail});

      const tutorRepo = AppDataSource.getRepository(Tutors);

      tutorRepo.save(tutApplicants);
      tutorRepo.save(tutAccepted);
      tutorRepo.save(labApplicants);
      tutorRepo.save(labAccepted);

        // AppDataSource.getRepository(Tutors).save([
        //   {
        //     email: inEmail,
        //     class_code: inSubject,
        //     role_name: inRole
        //   }

        // ]);
        return response.status(201).json(true);
    }
    catch(e)
    {
      return response.status(202).json(false);
    }
  }

  async countForLecturerClass(request: Request, response: Response) {
    try
    {
      const inLecturer: string = request.params.lecturer;
      
      const classes: number = await 
      AppDataSource
      .getRepository(Classes)
      .createQueryBuilder("classes")
      .leftJoin("classes.lecturers", "lecturer")
      .leftJoin("classes.tutors", "tutors")
      .where("lecturer.email = :email", {email: inLecturer})
      .andWhere("tutors.email IS NOT NULL")
      .andWhere("tutors.accepted = 0")
      .getCount();

      return response.status(200).json(classes);
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json(0);
    }
  }

  async getLecturerCourseDetails(request: Request, response: Response) {
    try
    {
      const inLecturer: string = request.params.lecturer;
      
      const applications = await AppDataSource.manager.query(
      `SELECT cl.class_code, cl.subject_name, IFNULL(calc.candidate_count, 0) as candidate_count 
        FROM classes cl
        LEFT JOIN lecturer_classes lc 
          ON lc.class_code = cl.class_code
        LEFT JOIN (
          SELECT cl.class_code, COUNT(*) as candidate_count
          FROM classes cl
          LEFT JOIN lecturer_classes lc 
            ON cl.class_code =lc.class_code
          LEFT JOIN tutors t 
            ON cl.class_code =t.class_code
          WHERE lc.email =? 
            AND t.email IS NOT NULL
            AND t.accepted = 0
          GROUP BY cl.class_code
        ) as calc
        ON calc.class_code = cl.class_code
        WHERE lc.email = ?;`,[inLecturer, inLecturer]);
  
      // https://github.com/typeorm/typeorm/issues/544
      // This says doing it in query builder isnt that good, instead use raw SQL 
      // It needs to cast the booleans to type boolean instead of string
      return response.status(200).json(
        applications.map(app => ({
            ...app,
            candidate_count: Number(app.candidate_count)
          }))
      );
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json(0);
    }
  }

  async isTutorInClass(request: Request, response: Response) {
    try
    {
      const inLecturer: string = request.params.lecturer;
      const inClassCode: string = request.params.classCode;
      
      const numberInClass: number = await 
      AppDataSource
      .getRepository(Classes)
      .createQueryBuilder("classes")
      .leftJoin("classes.lecturers", "lecturers")
      .where("classes.class_code = :code", {code: inClassCode})
      .andWhere("lecturers.email = :email", {email: inLecturer})
      .getCount();
  

      if(numberInClass >= 1)
      {
        return response.status(200).json(true);
      }
      else
      {
        return response.status(200).json(false);
      }
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json(false);
    }
  }
  
  async getTutorsInClass(request: Request, response: Response) {
    try
    {
      //Formatting for sending to front end
      function mapUserJoins(user: any) {
        return {
          ...user,
          certifications: user.certifications?.map(c => c.certification) ?? [],
          educations: user.educations?.map(e => e.education) ?? [],
          languages: user.languages?.map(l => l.language) ?? [],
          previous_roles: user.previous_roles?.map(p => p.prev_role) ?? [],
          skills: user.skills?.map(s => s.skill) ?? [],
        };
      }

      const inClassCode: string = request.params.classCode;
      
      const tutApplied: Tutors[] = await AppDataSource
      .getRepository(Tutors)
      .createQueryBuilder("tutor")
      .leftJoinAndSelect("tutor.user", "user")
      .leftJoinAndSelect("user.certifications", "certifications")
      .leftJoinAndSelect("user.educations", "eductions")
      .leftJoinAndSelect("user.languages", "languages")
      .leftJoinAndSelect("user.previous_roles", "previous_roles")
      .leftJoinAndSelect("user.skills", "skills")
      .where("tutor.class_code = :code", { code: inClassCode })
      .andWhere("tutor.role_name = :role", {role: "tutor"})
      .andWhere("tutor.accepted = :accepted", {accepted: false})
      .getMany();

      const tutAccepted: Tutors[] = await AppDataSource
      .getRepository(Tutors)
      .createQueryBuilder("tutor")
      .leftJoinAndSelect("tutor.user", "user")
      .leftJoinAndSelect("user.certifications", "certifications")
      .leftJoinAndSelect("user.educations", "eductions")
      .leftJoinAndSelect("user.languages", "languages")
      .leftJoinAndSelect("user.previous_roles", "previous_roles")
      .leftJoinAndSelect("user.skills", "skills")
      .where("tutor.class_code = :code", { code: inClassCode })
      .andWhere("tutor.role_name = :role", {role: "tutor"})
      .andWhere("tutor.accepted = :accepted", {accepted: true})
      .orderBy("tutor.ranking")
      .getMany();
``
      const labApplied: Tutors[] = await AppDataSource
      .getRepository(Tutors)
      .createQueryBuilder("tutor")
      .leftJoinAndSelect("tutor.user", "user")
      .leftJoinAndSelect("user.certifications", "certifications")
      .leftJoinAndSelect("user.educations", "eductions")
      .leftJoinAndSelect("user.languages", "languages")
      .leftJoinAndSelect("user.previous_roles", "previous_roles")
      .leftJoinAndSelect("user.skills", "skills")
      .where("tutor.class_code = :code", { code: inClassCode })
      .andWhere("tutor.role_name = :role", {role: "lab_assistant"})
      .andWhere("tutor.accepted = :accepted", {accepted: false})
      .getMany();

      const labAccepted: Tutors[] = await AppDataSource
      .getRepository(Tutors)
      .createQueryBuilder("tutor")
      .leftJoinAndSelect("tutor.user", "user")
      .leftJoinAndSelect("user.certifications", "certifications")
      .leftJoinAndSelect("user.educations", "eductions")
      .leftJoinAndSelect("user.languages", "languages")
      .leftJoinAndSelect("user.previous_roles", "previous_roles")
      .leftJoinAndSelect("user.skills", "skills")
      .where("tutor.class_code = :code", { code: inClassCode })
      .andWhere("tutor.role_name = :role", {role: "lab_assistant"})
      .andWhere("tutor.accepted = :accepted", {accepted: true})
      .orderBy("tutor.ranking")
      .getMany();

      return response.status(200).json(
        {
          tutorApplicants: tutApplied.map(t => mapUserJoins(t.user)),
          tutorAccepted: tutAccepted.map(t => mapUserJoins(t.user)),
          labApplicants: labApplied.map(t => mapUserJoins(t.user)),
          labAccepted: labAccepted.map(t => mapUserJoins(t.user))
        }
      );
    }
    catch(e)
    {
      console.log(e);
      return response.status(400).json({
        tutorApplicants:[],
        tutorAccepted:[],
        labApplicants:[],
        labAccepted:[],
      });
    }
  }

  async searchClasses(request: Request, response: Response) {
    try{
      // Whether to show only people with 0, ascending != 0, descending != 0, unsorted
      const sort: string = request.params.sort;
      const filter: string = request.params.filter;
      const search: string = request.params.search;
      // const availability: string = request.params.availability;
      // const type: string = request.params.type;

      
      
      // Get users that meet the search criteria
      const returnedUsers: Users[] = await AppDataSource.getRepository(Users)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.tutorJoin", "tutorJoin")
      .leftJoinAndSelect("users.certifications", "certifications")
      .leftJoinAndSelect("users.educations", "eductions")
      .leftJoinAndSelect("users.languages", "languages")
      .leftJoinAndSelect("users.previous_roles", "previous_roles")
      .leftJoinAndSelect("users.skills", "skills")
      .getMany();
      
    let returnedData: userSearchResults[] = await Promise.all(
      // Then for each of the users
      returnedUsers.map(async (user: Users) => {
        // Variables to be pushed to the returnedData
        const tempFormatApplied: classSearchResults[] = [];
        const tempFormatAccepted: classSearchResults[] = [];
        // Get class code, subject name, tutor and lab_assitant for applied
        const tempAp = await AppDataSource.manager.query(`
          SELECT DISTINCT c.class_code, 
          c.subject_name, 
          IF(EXISTS(
            SELECT *
            FROM tutors
            WHERE class_code = c.class_code
            AND email = t.email
            AND role_name = "tutor"
            AND accepted = false
            ), 1, 0) as tutor, 
            IF(EXISTS(
              SELECT *
              FROM tutors
              WHERE class_code = c.class_code
              AND email = t.email
              AND role_name = "lab_assistant"
              AND accepted = false
          ), 1, 0) as lab_assistant
          FROM classes c
          LEFT JOIN tutors t
          ON c.class_code = t.class_code
          WHERE t.email = ?
          AND accepted = false;`, [user.email]);
          
        // Get class code, subject name, tutor and lab_assitant for accepted
        const tempAcc = await AppDataSource.manager.query(`
          SELECT DISTINCT c.class_code, 
          c.subject_name, 
          IF(EXISTS(
            SELECT *
            FROM tutors
            WHERE class_code = c.class_code
            AND email = t.email
            AND role_name = "tutor"
            AND accepted = true
            ), 1, 0) as tutor, 
            IF(EXISTS(
              SELECT *
              FROM tutors
              WHERE class_code = c.class_code
              AND email = t.email
              AND role_name = "lab_assistant"
              AND accepted = true
              ), 1, 0) as lab_assistant
              FROM classes c
              LEFT JOIN tutors t
              ON c.class_code = t.class_code
              WHERE t.email = ?
              AND accepted = true;`, [user.email]);

        tempAp.forEach((ap) => {
          tempFormatApplied.push(
            {
              "courseCode": ap.class_code,
              "courseName": ap.subject_name,
              "tutorStatus": Boolean(ap.tutor),
              "labStatus": Boolean(ap.lab_assistant)
            }
          )
        });

        let acceptedCount: number = 0;
        
        tempAcc.forEach((ap) => {
          tempFormatAccepted.push(
            {
              "courseCode": ap.class_code,
              "courseName": ap.subject_name,
              "tutorStatus": Boolean(ap.tutor),
              "labStatus": Boolean(ap.lab_assistant)
            }
          );
          if(ap.tutor)
            acceptedCount++;
          if(ap.lab_assistant)
            acceptedCount++;
        });
        
        

        return {
          "person": {
            ...user,
            certifications: user.certifications?.map(c => c.certification) ?? [],
            educations: user.educations?.map(e => e.education) ?? [],
            languages: user.languages?.map(l => l.language) ?? [],
            previous_roles: user.previous_roles?.map(p => p.prev_role) ?? [],
            skills: user.skills?.map(s => s.skill) ?? [],
          },
          "applied": tempFormatApplied,
          "accepted": tempFormatAccepted,
          "timesAccepted": acceptedCount
        };
      })
    );
      
      return response.status(200).json(returnedData);
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
