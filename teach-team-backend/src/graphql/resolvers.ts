import bcrypt from "bcryptjs";
import { UserController } from "../controller/UserController";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Classes } from "../entity/Classes";

interface updateReturn{
    success: boolean,
    return: any[]
}

function isUppercase(inputString: string){
    try{
        const regex = new RegExp("[0-9]");
        const formatString = inputString.substring(0,4);
        if(regex.test(formatString)){
            return false;
        }
        if(formatString === formatString.toUpperCase()){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function isLetterUppercase(inputString: string, pos: number){
    try{
        const formatString = inputString.substring(pos,pos+1);
        if(formatString)
        if(formatString === formatString.toUpperCase()){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function isNumbers(inputString: string){
    try{
        const regex = new RegExp("^[0-9]+$");
        const formatString = inputString.substring(4);
        if(formatString.length < 4){
            return false;
        }
        if(!regex.test(formatString)){
            return false;
        }
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function duplicateCheck(inputString: string){
    let tempCheck: boolean = true;

    return tempCheck;
}

const userController = new UserController();

export const resolvers = {
    Query:{
        users: async () => {
            return await AppDataSource.manager.find(Users);
        },

        user: async (_: any, { identifier }: {identifier: string}) => {
            const user: Users = await AppDataSource.createQueryBuilder()
            .select("users")
            .from(Users, "users")
            .where("users.email = :email", { email: identifier })
            .getOne();

            if(user){
                return (user);
            }
            else{
                return (null);
            }
        },

        lecturers: async () => {
            const lecturers = await AppDataSource.getRepository(Users).find({ where: { role: "lecturer" } });
            for (const lecturer of lecturers) {
                lecturer.lectures = await AppDataSource
                    .getRepository(Classes)
                    .createQueryBuilder("classes")
                    .leftJoin("classes.lecturers", "lecturer")
                    .where("lecturer.email = :email", { email: lecturer.email })
                    .getMany();
            }
            return lecturers;
        },

        tutors: async () => {
            return await AppDataSource.getRepository(Users).find({ where: { role: "candidate" } });
        },

        courseLecturers: async (_: any, { courseCode }: {courseCode: string}) => {
            const lectReturnSort = await AppDataSource.manager.query(`
                SELECT DISTINCT lc.email 
                    FROM classes c
                LEFT JOIN lecturer_classes lc 
                    ON c.class_code = lc.class_code
                WHERE c.class_code = ?;
            `, [courseCode]);

            const excluded = lectReturnSort.map((l) => {return l.email});

            const lecturers = await AppDataSource.getRepository(Users).createQueryBuilder("users")
            .where("role = \"lecturer\"")
            .andWhere("email NOT IN (:...emails)", { emails: excluded})
            .getMany();

            for (const lecturer of lecturers) {
                lecturer.lectures = await AppDataSource
                    .getRepository(Classes)
                    .createQueryBuilder("classes")
                    .leftJoin("classes.lecturers", "lecturer")
                    .where("lecturer.email = :email", { email: lecturer.email })
                    .getMany();
            }
            return lecturers;           
        },

        courses: async () => {
            return await AppDataSource.manager.find(Classes);
        },

        validLogin: async (_: any, { identifier, passphrase }: {identifier: string, passphrase: string}) => {
            const user: Users[] = await AppDataSource.manager.find(Users,
                {where:{
                    email: identifier
                }}
            );

            if(user.length > 0){
                return(bcrypt.compareSync(passphrase, user[0].password))
            }
            else{
                return (false);
            }
        },

        validAdminLogin: async (_: any, { identifier, passphrase }: {identifier: string, passphrase: string}) => {
            const user: Users[] = await AppDataSource.manager.find(Users,
                {where:{
                    email: identifier,
                    role: "admin"
                }}
            );

            if(user.length > 0){
                return(bcrypt.compareSync(passphrase, user[0].password))
            }
            else{
                return (false);
            }
        }
    },

    Mutation:{
        addLecturer: async (_: any, { email, class_code }: {email: string, class_code: string}) => {
            try{
                const classRepo = AppDataSource.getRepository(Classes);
                // Get the class required and join on lecturers
                const classObj: Classes = await classRepo.findOne({ where: { class_code }, relations: ["lecturers"] });
                const lecturer = await AppDataSource.getRepository(Users).findOne({ where: { email } });

                // If classObj and lecturer are valid, proceed to adding a lecturer
                if (classObj && lecturer) {
                    // Duplicate prevention so that the database is less likely to freak out
                    if (!classObj.lecturers.find(l => l.email === lecturer.email)) {
                        classObj.lecturers.push(lecturer);
                    }
                    // Save the updated class
                    await classRepo.save(classObj);
                }

                // If I don't add this around the end return, it will start throwing errors if the class code is invalid
                if(classObj){

                    const returnedClasses = await AppDataSource.manager.find(Classes);
                    
                    // Copied from other method
                    const lectReturnSort = await AppDataSource.manager.query(`
                        SELECT DISTINCT lc.email 
                        FROM classes c
                        LEFT JOIN lecturer_classes lc 
                        ON c.class_code = lc.class_code
                        WHERE c.class_code = ?;
                        `, [class_code]);
                        
                        const excluded = lectReturnSort.map((l) => {return l.email});
                        
                        const lecturers = await AppDataSource.getRepository(Users).createQueryBuilder("users")
                        .where("role = \"lecturer\"")
                    .andWhere("email NOT IN (:...emails)", { emails: excluded})
                    .getMany();
                    
                    for (const lecturer of lecturers) {
                        lecturer.lectures = await AppDataSource
                        .getRepository(Classes)
                        .createQueryBuilder("classes")
                        .leftJoin("classes.lecturers", "lecturer")
                        .where("lecturer.email = :email", { email: lecturer.email })
                        .getMany();
                    }
                    
                    return {success: true, courseReturn: returnedClasses, lectureReturn: lecturers};
                }
                else{
                    return { success: false, courseReturn: [], lectureReturn: [] };
                }
            }
            catch(e){
                console.log(e);
                return { success: false, courseReturn: [], lectureReturn: [] };
            }
        },

        addCourse: async (_: any, { codeIn, nameIn }: {codeIn: string, nameIn: string}) => {
            try{
                let isSuccessful = true;

                if(!duplicateCheck(codeIn)){
                    isSuccessful = false;
                }

                if(!isUppercase(codeIn)){
                    isSuccessful = false;
                }
                
                if(!isNumbers(codeIn)){
                    isSuccessful = false;
                }
                
                if(!isLetterUppercase(codeIn, 0)){
                    isSuccessful = false;
                }
                
                if(nameIn.length <= 0){
                    isSuccessful = false;
                }
                
                if(codeIn.length <= 0){
                    isSuccessful = false;
                }

                if(isSuccessful){
                    await AppDataSource.getRepository(Classes)
                    .save({
                        class_code: codeIn,
                        subject_name: nameIn
                    });
                }

                //Get updated classes to return
                const updatedClasses = await AppDataSource.manager.find(Classes);
                return ({success: isSuccessful, return: updatedClasses});
            }
            catch(e){
                console.log(e);
                return ({success: false, return: []});
            }

        },

        toggleSuspend: async (_: any, { email }: {email: string}) => {
            try{
                const user: Users = await AppDataSource.getRepository(Users).findOne({ where: { email } });
                let isSuccessful = true;
                if(user){
                    user.active = !user.active; // Toggle the active status

                    await AppDataSource.getRepository(Users).save(user);
                }
                else{
                    isSuccessful = false;
                }
                
                // Return updated data
                const returnUser = await AppDataSource.getRepository(Users).find({ where: { role: "candidate" } });

                return {success: isSuccessful, userReturn: returnUser};
            }
            catch(e){
                console.log(e);
                return { success: false, return: [] };
            }
        }
    },
};