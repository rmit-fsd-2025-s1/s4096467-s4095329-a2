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
        return data.validAdminLogin.validAdminLogin;
    }

};