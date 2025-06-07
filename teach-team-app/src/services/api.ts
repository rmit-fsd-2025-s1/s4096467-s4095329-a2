import { SubjectProps, tutorClassObj } from "@/components/Home/Home";
import { classTable, saveClassTable } from "@/helpers/validate";
import { User } from "../helpers/validate";
import axios from "axios";
import { detailsDB } from "@/pages/educator/userProfile";
import { deleteField } from "@/helpers/frontendHelper";

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
      const responseData: boolean = response.data;
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

  getFullName: async (emailIn: string) => {
    const response = await api.get(`/users/fullName/${emailIn}`);
    const responseData: string = response.data;
    return responseData;
  },
  
    // Sort is the sort button that changes the order depending on the accepted count
    // Filter is the three buttons that change the search filtering
    // Search is the text input
    // Availability is the <select> for availability
    // Type is the <select> for roles tutor / lab-assistant
  searchData: async (sort: string, filter: string, search: string, availability: string, type: string) =>{
    const response = await api.get(`/classes/search/${sort}/${filter}/${search.length == 0? "@undef": search}/${availability === "None" ? availability : availability.toLowerCase()}/${type === "Lab-Assistant" ? "lab_assistant" : type.toLowerCase()}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserByEmail: async (email: string) => {
    const response = await api.get(`/users/${email}`);
    return response.data;
  },

  createUser: async (newUser: Partial<User>) => {
    const response = await api.post('/users', newUser);
    return response.data;
  },

  postField: async (field: keyof detailsDB, text: string, email: string) => {
    const response = await api.post(`/users/${email}`, {field, text, email});
    return response.data;
  },

  deleteField: async (field: keyof detailsDB, key: number, email: string) => {
    const response = await api.delete(`/users/${email}`, {params: {field, key, email}});
    return response.data;
  }
};
