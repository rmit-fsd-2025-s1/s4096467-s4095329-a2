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

    type Query{
        users: [User]
    }

    type Mutation{
        addLecturer(
            email: String!
            course_code: String!
        ): Boolean!
    }
`;