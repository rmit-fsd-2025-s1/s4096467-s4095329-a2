import { SubjectProps, tutorClassObj } from "@/components/Home/Home";
import { classTable, saveClassTable } from "@/helpers/validate";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust this to match your backend URL
});

export const userApi = {
  checkLogin: async (email: string, password: string) => {
      const response = await api.get(`/users/login/${email}/${password}`);
      return response.data;
  },

  getType: async (email: string) => {
      const response = await api.get(`/users/type/${email}`);
      return response.data;
  },

  getCandidateCountLecturer: async (email: string) => {
      const response = await api.get(`/classes/${email}/candidates/count/`);
      return response.data;
  },

  getApplications: async (email: string) => {
      const response = await api.get(`/users/appliedClasses/${email}`);
      const responseData: tutorClassObj[] = response.data;
      return responseData;
  },

  getCourseCardInfo: async (email: string) => {
      const response = await api.get(`/classes/${email}/courseCandidates/count`);
      const responseData: SubjectProps[] = response.data;
      return responseData;
  },

  getCandidatesFor: async (classCode: string) => {
      const response = await api.get(`/classes/tutors/${classCode}`);
      const responseData: classTable = response.data;
      return responseData;
  },

  setCandidatesFor: async (classDetails: saveClassTable) => {
    try
    {
      const response = await api.post(`/classes/tutors/update`, {classInfo: classDetails});
      const responseData = response.data;
      return responseData;
    }
    catch(e)
    {
      console.log(e); 
    }
  },

  isLecturingClass: async (email: string, classCode: string) => {
      const response = await api.get(`/classes/${classCode}/hasLecturer/${email}`);
      const responseData: boolean = response.data;
      return responseData;
  },

  applyToCourse: async (emailIn: string, subjectIn: string, roleIn: string) => {
        const response = await api.post(`/users/applyToClass`, {email: emailIn, subject: subjectIn, role: roleIn});
        return response;
    },

  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};
