import { gql } from "@apollo/client";
import { client } from "./apollo-client"
import { User } from "@/data-types/User";

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

export const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const { data } = await client.query({query: GET_USERS});
        return data.users;
    },

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

};