import { Request, Response } from "express";

export class GuideController {

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async guide(request: Request, response: Response) {
    try{
      const tutorial =
      {
        "/api":{
          "description": "Returns a guide for the API, including all available endpoints and their descriptions.",
          "/users":{
            "returnMethod":{
              "description": "Returns all of the users stored in the database, using the eager parameter to also return the various arrays joined automatically.",
              "returnType": "Users[]"
            },

            "/login/:email/:password":{
              "returnMethod":{
                "description": "Returns a boolean value based on whether the supplied password matches with the hash in the database.",
                "returnType": "boolean"
              },
              "parameters":{
                "email": "string",
                "password": "string"
              }
            },
            "/type/:email":{
              "returnMethod":{
                "description": "Returns the type of user, either candidate, lecturer or admin.",
                "returnType": "string"
              },
              "parameters":{
                "email": "string"
              }
            },
            "/appliedClasses/:email":{
              "returnMethod":{
                "description": "Returns a boolean value based on whether the user has applied to classes or not.",
                "returnType": "boolean"
              },
              "parameters":{
                "email": "string"
              }
            },
            "POST: /applyToClass":{
              "returnMethod":{
                "description": "Saves the passed in tutor to the specified class and role in the database.",
                "returnType": "boolean"
              },
              "parameters":{
                "email": "string",
                "classCode": "string",
                "role": "string"
              }
            }
          },
          "/classes":{
            "returnMethod":{
              "description": "Returns all classes in the database, using the eager parameter to also return the various arrays joined automatically.",
              "returnType": "Classes[]"
            },
            "/tutors":{
              "/:classCode":{
                "returnMethod":{
                  "description": "Returns all of the tutors both applied and accepted in both roles tutor and lab-assistant for a specified class code.",
                  "returnType": "{tutorApplicants: User[], tutorAccepted: User[], labApplicants: User[], labAccepted: User[]}"
                },
                "/hasLecturer/:lecturer/":{
                  "returnMethod":{
                    "description": "Checks to see if the specified lecturer is teaching the specified class code.",
                    "returnType": "boolean"
                  },
                  "parameters":{
                    "classCode": "string",
                    "lecturer": "string"
                  }
                },
              },
              "POST: /update":{
                "returnMethod":{
                  "description": "Saves the supplied data to the database using typeorm - save to save new users and update existing ones.",
                  "returnType": "boolean"
                },
                "parameters":{
                  "classInfo":{
                    "tutorApplicants": "Tutors[]",
                    "tutorAccepted": "Tutors[]",
                    "labApplicants": "Tutors[]",
                    "labAccepted": "Tutors[]"
                  }
                }
              }
            },
            "/:lecturer":{
              "candidates/count/":{
                "returnMethod":{
                  "description": "Returns the number of new applicants in the lecturer's dashboard.",
                  "returnType": "number"
                },
                "parameters":{
                  "lecturer": "string"
                }
              },
              "courseCandidates/count/":{
                "returnMethod":{
                  "description": "Returns the course cards featured in the lecturer's dashboard. Contains class code / name and candidate counts for the classes.",
                  "returnType": {
                    "Array[]:":{
                      "class_code": "string",
                      "subject_name": "string",
                      "candidate_count": "number"
                    }
                  }
                },
                "parameters":{
                  "lecturer": "string"
                }
              }
            },
            "/search/:sort/:filter/:search/:availability/:type":{
              "returnMethod":{
                "description": "Returns the information searched for in the lecturer's dashboard based on the parameters supplied.",
                "returnType": "WIP - See when feature is implemented"
              },
              "parameters":{
                "sort": "string",
                "filter": "string",
                "search": "string",
                "availability": "string",
                "type": "string"
              }
            }
          },
        }
      };

    return response.json(tutorial);
    }
    catch(e)
    {
      console.log(e);
      return response.status(400);
    }
  }
}
