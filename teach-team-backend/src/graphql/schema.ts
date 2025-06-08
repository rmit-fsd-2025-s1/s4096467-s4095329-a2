import gql from "graphql-tag";

export const typeDefs = gql`
    type User{
        email: String
        full_name: String
        password: String
        role: String
        availability: String
        summary: String 
        active: Boolean
    }

    type Lecturer{
        email: String
        full_name: String
        password: String
        role: String
        availability: String
        summary: String 
        active: Boolean   
        lectures: [Course]
    }

    type CourseConfirmation{
        success: Boolean
        return: [Course]
    }

    type CourseConfirmation {
        success: Boolean
        message: String
        return: [Course]
    }

    type AssignmentConfirmation{
        success: Boolean
        courseReturn: [Course]
        lectureReturn: [Lecturer]
    }

    type UserConfirmation{
        success: Boolean
        userReturn: [User]
    }

    type Course{
        class_code: String
        subject_name: String
        lecturers: [User]
    }

    type Query{
        users: [User]
        user(identifier: String!): User
        lecturers: [Lecturer]
        tutors: [User]
        courses: [Course]
        courseLecturers(courseCode: String!): [Lecturer]
        validLogin(identifier: String!, passphrase: String!): Boolean!
        validAdminLogin(identifier: String!, passphrase: String!): Boolean!
    }

    type Mutation{
        addCourse(
            codeIn: String!
            nameIn: String!
        ): CourseConfirmation
        addLecturer(
            email: String!
            class_code: String!
        ): AssignmentConfirmation
        deleteCourse(
            courseCode: String!
        ): CourseConfirmation
        toggleSuspend(
            email: String!
        ): UserConfirmation
    }
`;