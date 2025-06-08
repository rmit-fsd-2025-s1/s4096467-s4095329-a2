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

    type CourseConfirmation{
        success: Boolean
        return: [Course]
    }

    type Course{
        class_code: String
        subject_name: String
    }

    type Query{
        users: [User]
        user(identifier: String!): User
        courses: [Course]
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
        ): Boolean!
    }
`;