import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Languages } from "../entity/Languages";
import { Certifications } from "../entity/Users";
import { Comments } from "../entity/Comments";
import { Previous_Roles } from "../entity/Previous_Roles";
import { Skills } from "../entity/Skills";
import { Educations } from "../entity/Educations";
import bcrypt from "bcryptjs";

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

  async applicationCheck(request: Request, response: Response) {
    try
    {
      const inEmail: string = request.params.email;
      //This query is genuinely the new worst code I have written
      const applications = await AppDataSource.manager.query(
       `SELECT classes.class_code, classes.subject_name , COALESCE(derived_table1.labApplied, 0) as labApplied, COALESCE(derived_table2.tutorApplied, 0) as tutorApplied 
        FROM classes
        LEFT JOIN (
            SELECT t2.class_code AS c2, (t2.accepted IS NOT NULL)+(t2.accepted) as labApplied
            FROM tutors AS t2
            WHERE t2.email = ?
              AND t2.role_name = 'lab_assistant'
        ) AS derived_table1
        ON classes.class_code = derived_table1.c2
        LEFT JOIN(
          SELECT t3.class_code as c3, (t3.accepted IS NOT NULL)+(t3.accepted) as tutorApplied 
          FROM tutors as t3
          WHERE t3.email = ?
            AND t3.role_name = 'tutor'
        ) AS derived_table2
        ON classes.class_code = derived_table2.c3;`
      ,[inEmail, inEmail]);
  
      // The query is too complex for querybuilder at this time
      // It needs to cast the booleans to type boolean instead of string
      return response.status(200).json(
        applications.map(app => ({
            ...app,
            labApplied: Number(app.labApplied),
            tutorApplied: Number(app.tutorApplied)
          }))
      );
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

  async userInfo(request: Request, response: Response) {
    try{
      const inEmail: string = request.params.email;
      const user = await AppDataSource.manager.findOne(Users, {
        where: { email: inEmail },
      });

      if (!user) {
          return response.status(404).json({ 
              success: false,
              message: "User not found",
          });
      }

        const userData = {
            summary: user.summary || "", 
            skills: user.skills || [],  
            certifications: user.certifications || [],
            languages: user.languages || [],
            previous_roles: user.previous_roles || [],
            availability: user.availability || "None",
            educations: user.educations || [],
        };

      response.status(200).json({userData});

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
      const user4Exist = await userRepo.findOneBy({ email: "connor@gmail.com" });
      const user5Exist = await userRepo.findOneBy({ email: "will@gmail.com" });

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

      if(!user4Exist)
        {
          await userRepo
          .save([
            {
              email: "connor@gmail.com",
              full_name: "Connor",
              password: "$2b$10$8C6C.0Ph4SljkgQchNCxuu/BaMwziIA3Uz66S/5rciwtUJflURPlK",
              role: "lecturer",
            }
          ]);
        }
      
      if(!user5Exist)
        {
          await userRepo
          .save([
            {
              email: "will@gmail.com",
              full_name: "Will",
              password: "$2b$10$IVaJqtZuG1oo6xj2lHi/4.20ZWCbYWPgtqA7r0.aBKrxvF699.skq",
              role: "lecturer",
            }
          ]);
        }
    }
    catch(e)
    {
      console.log(e);
    }
  }

  async registerUser(request: Request, response: Response) {
    //Contains data sent in HTTP request from the api call. //just self notes cuz im learning how this works
    const email = request.body.email;
    const password = request.body.password;
    const role = request.body.role;

    //hash password
    const hashed = await bcrypt.hash(password, 10);

    //Validation
    const specialChars = /[\\|,.<>\/?~ `!@#$%^&*(){}_\-+=:;"'\[\]]/;
    const letters = /[a-zA-Z]/;
    const hasLetter = letters.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSymbol = specialChars.test(password);
    const length = password.length;
    const isStrong = length >= 8 && hasSymbol && hasUpper && hasLetter;

    if (!isStrong) {
      return response.status(500).json({ success: false, message: "Password Mismatch" });
    }

    try {
      //Get data source
      const userRepository = AppDataSource.getRepository(Users);

      //Check if user exists
      const existingUser = await userRepository.findOneBy({email});

    if (existingUser) {
      return response.status(400).json({ success: false, message: "User already exists" });
    }
      
      //Create instance of object. email = request.body.email etc from the lines above.
      const newUser = userRepository.create({
        email,
        password: hashed,
        role, 
      });
      
      //Create new user to database
      await userRepository.save(newUser);
      return response.status(201).json({ success: true, message: "User registered" });

    } 
    catch (error) {
      console.log("Error during save")
      return response.status(500).json({ success: false, message: "Server error" });
    }
  };

  async postField(request: Request, response: Response) {
    try {
      const { email } = request.params; 
      const { field, text } = request.body;

      const userRepository = AppDataSource.getRepository(Users);

      console.log("TESTING")
      console.log(email)
      console.log(field)
      console.log(text)
    
      //This will causes errors if not defined correctly
      // Find user with their existing field
      if (field !== "summary" && field !== "availability") {
        const user = await userRepository.findOne({ 
        where: { email },
        relations: [field] 
        });
      }

      //Most unscalable code ive writte lol. 
      if (field === "languages") {
        //Get languages repo
        const repo = AppDataSource.getRepository(Languages);
        
        //Create an new instance of a Language, and set new fields to push.
        const newEntry = new Languages();
          newEntry.language = text;
          newEntry.user_key = email; //Since we have no ID i think Id use email

        //Save the language. Language_key is automatically set. (we dont use it) (we would use the array element index to delete a specific element)
        await repo.save(newEntry);
      } 
      else if (field === "summary") {
        //Slight modifications to languages
        const repo = AppDataSource.getRepository(Users);
        const user = await repo.findOneBy({email});
                
        if (user) {
          user.summary = text;
          await repo.save(user);
          //We dont want to use updatedUser
          return response.status(200).json({ message: 'Summary updated' });
        }
      } 
      else if (field === "availability") {
        const repo = AppDataSource.getRepository(Users);
        const user = await repo.findOneBy({email});
                
        if (user) {
          user.availability = text;
          await repo.save(user);
          //We dont want to use updatedUser
          return response.status(200).json({ message: 'Availability updated' });
        }
      } 
      else if (field === "certifications") {
        const repo = AppDataSource.getRepository(Certifications);
        const newEntry = new Certifications();
          newEntry.certification = text;
          newEntry.user_key = email; 
        await repo.save(newEntry);
      }
      else if (field === "previous_roles") {
        const repo = AppDataSource.getRepository(Previous_Roles);
        const newEntry = new Previous_Roles();
          newEntry.prev_role = text;
          newEntry.user_key = email; 
        await repo.save(newEntry);
      }
      else if (field === "educations") {
        const repo = AppDataSource.getRepository(Educations);
        const newEntry = new Educations();
          newEntry.education = text;
          newEntry.user_key = email; 
        await repo.save(newEntry);
      }
      else if (field === "skills") {
        const repo = AppDataSource.getRepository(Skills);
        const newEntry = new Skills();
          newEntry.skill = text;
          newEntry.user_key = email; 
        await repo.save(newEntry);
      }
      else {
        return response.status(500).json({ success: false, message: "Field Error" });
      }

      //Retrieve and return
      const updatedUser = await userRepository.findOne({
        where: { email },
        relations: [field]
      });

      return response.status(200).json(updatedUser);
    } 
    catch (error) {
      console.log("Error during save")
      return response.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteField(request: Request, response: Response) {
    try {
      //Must case as string to prevent ParsedQs error
      const email = request.params.email; 
      const field = request.query.field as string;
      const key = request.query.key as string;

      if (!field || !key) {
        return response.status(400).json({ success: false, message: "Missing field or key" });
      }

      //Get specific user field
      const userRepository = AppDataSource.getRepository(Users);
      const user = await userRepository.findOne({ 
        where: { email },
        relations: [field] 
      });

      let repo: any;
      let keyName: string;

      //switch statement to get key names 
      switch (field) {
      case "certifications":
        repo = AppDataSource.getRepository(Certifications);
        keyName = "certification_key";
        break;
      case "languages":
        repo = AppDataSource.getRepository(Languages);
        keyName = "language_key";
        break;
      case "skills":
        repo = AppDataSource.getRepository(Skills);
        keyName = "skill_key";
        break;
      case "educations":
        repo = AppDataSource.getRepository(Educations);
        keyName = "education_key";
        break;
      case "previous_roles":
        repo = AppDataSource.getRepository(Previous_Roles);
        keyName = "role_key";
        break;
      default:
        return response.status(400).json({ success: false, message: "Invalid field" });
    }

    //Delete entry from the database
    const deleted = await repo.delete({ [keyName]: Number(key) });

    const updatedUser = await userRepository.findOne({
      where: { email },
      relations: [field],
    });

    return response.status(200).json(updatedUser);
    } 
    catch (error) {
      console.log("Error")
      return response.status(500).json({ success: false, message: "Server error" });
    }
  }
}
