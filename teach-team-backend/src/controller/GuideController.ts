import { Request, Response } from "express";

export class GuideController {

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async guide(request: Request, response: Response) {
    const tutorial = 
    {
        "/api":
        {
            "/users":
            {
                "returnMethod":
                {
                    "description": "Returns all of the users stored in the database, using the eager parameter to also return the various arrays joined automatically",
                    "returnType": "Users[]"
                },

                "/login/:email/:password":
                {
                    "returnMethod":
                    {
                        "description": "Returns a boolean value based on whether the supplied password matches with the hash in the database",
                        "returnType": "boolean"
                    }
                }
            }
        }
    };

    return response.json(tutorial);
  }
}
