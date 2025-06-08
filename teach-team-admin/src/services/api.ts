import { gql } from "@apollo/client";
import { client } from "./apollo-client"
import { User, UserReturn } from "@/data-types/User";
import { Courses, UpdateCourses, UpdateCoursesReturn } from "@/data-types/Courses";

// GraphQL Queries
const GET_USERS = gql`
    query GetUsers {
        users{
            email
            full_name
            password
            role
            availability
            summary
            active 
        }
    }
`;

const VALIDATE_LOGIN = gql`
    query ValidateAdministratorLogin($identifier: String!, $passphrase: String!) {
        validAdminLogin(identifier: $identifier, passphrase: $passphrase)
    }
`;

const GET_FULLNAME = gql`
    query GetFullName($identifier: String!){
        user(identifier: $identifier){
            full_name
        }
    }
`;

const GET_USER_ROLE= gql`
    query GetUserRole($identifier: String!){
        user(identifier: $identifier){
            role
        }
    }
`;

const GET_COURSES = gql`
    query GetCourses{
        courses{
            class_code
            subject_name
            lecturers {
                email
                full_name
                password
                role
                availability
                summary
                active
            }
            tutors {
                email
                class_code
                role_name
                accepted
                active_tutor
                ranking
                user {
                    email
                    full_name
                    password
                    role
                    availability
                    summary
                    active
                }
            }
        }
    }
`;

const SAVE_COURSE = gql`
    mutation Mutation($codeIn: String!, $nameIn: String!) {
        addCourse(codeIn: $codeIn, nameIn: $nameIn) {
            return {
            class_code
            subject_name
            }
            success
        }
    }
`;

const ADD_LECTURER_CLASS = gql`
    mutation UpdateClassLecturer($email: String!, $classCode: String!) {
        addLecturer(email: $email, class_code: $classCode) {
            success
            lectureReturn {
            lectures {
                class_code
                subject_name
            }
            summary
            role
            password
            full_name
            email
            availability
            active
            }
            courseReturn {
            class_code
            subject_name
            lecturers {
                email
                full_name
            }
            }
        }
    }
`;

const GET_LECTURERS = gql`
    query getLecturers {
        lecturers {
            email
            full_name
            password
            role
            availability
            summary
            active
            lectures {
                class_code
                subject_name
            }
        }
    }
`;

const TOGGLE_SUSPEND = gql`
    mutation Mutation($email: String!) {
        toggleSuspend(email: $email) {
            success
            userReturn {
                email
                full_name
                password
                role
                availability
                summary
                active
            }
        }
    }
`;

const GET_TUTORS = gql`
    query Query {
        tutors {
            email
            full_name
            password
            role
            availability
            summary
            active
        }
    }
`;

const GET_LECTURERS_FOR = gql`
    query getLecturersFor($courseCode: String!) {
        courseLecturers(courseCode: $courseCode) {
            email
            full_name
            password
            role
            availability
            summary
            active
            lectures {
                class_code
                subject_name
            }
        }
    }
`;

const DELETE_COURSE = gql`
    mutation DeleteCourse($courseCode: String!) {
        deleteCourse(courseCode: $courseCode) {
            success
            message
        }
    }
`;

export const userService = {
    // Returns all users
    getAllUsers: async (): Promise<User[]> => {
        const { data } = await client.query({query: GET_USERS});
        return data.users;
    },

    // Returns boolean if login is correct for admin
    validateLogin: async (identifierIn: string, passwordIn: string): Promise<boolean> => {
        const { data } = await client.query({
            query: VALIDATE_LOGIN,
            variables: {
            identifier: identifierIn,
            passphrase: passwordIn
            }
        });
        return data.validAdminLogin;
    },

    // Gets a user's full name
    getFullname: async (identifierIn: string): Promise<string> => {
        const { data } = await client.query({
            query: GET_FULLNAME,
            variables: {
                identifier: identifierIn,
            }
        });

        // Prevents TypeError data.user is null
        if(!data.user){
            return "No Name";
        }

        return data.user.full_name;
    },

    // Gets all courses
    getAllCourses: async (): Promise<Courses[]> => {
        const { data } = await client.query({
            query: GET_COURSES
        });
        return data.courses;
    },

    // Gets all lecturers
    getAllLecturers: async (): Promise<User[]> => {
        const { data } = await client.query({
            query: GET_LECTURERS
        });
        return data.lecturers;
    },

    //Gets all tutors
    getAllTutors: async (): Promise<User[]> => {
        const { data } = await client.query({
            query: GET_TUTORS
        });
        return data.tutors;
    },

    // Gets all lecturers
    getLecturersFor: async (courseName: string): Promise<User[]> => {
        const { data } = await client.query({
            query: GET_LECTURERS_FOR,
            variables: {
                courseCode: courseName,
            }
        });
        console.log(data);
        return data.courseLecturers||[];
    },

    addLecturerToClass: async (emailIn: string, classCodeIn: string): Promise<UpdateCoursesReturn> => {
        const { data } = await client.mutate({
            mutation: ADD_LECTURER_CLASS,
            variables: {
                email: emailIn,
                classCode: classCodeIn
            }
        });
        return data.addLecturer;
    },

    // Adds a new course, returning the updated result and a boolean if it has succeeded
    addNewCourse: async (codeAPIin: string, nameAPIin: string): Promise<UpdateCourses> => {
        const { data } = await client.mutate({
            mutation: SAVE_COURSE,
            variables:{
                codeIn: codeAPIin,
                nameIn: nameAPIin
            }
        });
        return data.addCourse;
    },

    // Toggles a user's suspension status
    toggleSuspend: async (emailIn: string): Promise<UserReturn> => {
        const { data } = await client.mutate({
            mutation: TOGGLE_SUSPEND,
            variables: {
                email: emailIn,
            }
        });
        return data.toggleSuspend
    },

    // Checks a user's role
    getRole: async (identifierIn: string): Promise<string> => {
        const { data } = await client.query({
            query: GET_USER_ROLE,
            variables: {
                identifier: identifierIn,
            }
        });

        // Prevents TypeError data.user is null
        if(!data.user){
            return "None";
        }

        return data.user.role;
    },

    // Delete course
    deleteCourse: async (course: Courses): Promise<boolean> => {
        const { data } = await client.mutate({
            mutation: DELETE_COURSE,
            variables: {
                courseCode: course.class_code
            },
        });

        return data.deleteCourse?.success?? false;   
    }

};