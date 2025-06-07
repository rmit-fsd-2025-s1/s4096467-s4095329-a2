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
        user(identifier: String!): User
        validLogin(identifier: String!, passphrase: String!): Boolean!
        validAdminLogin(identifier: String!, passphrase: String!): Boolean!
    }

    type Mutation{
        addLecturer(
            email: String!
            course_code: String!
        ): Boolean!
    }
`;