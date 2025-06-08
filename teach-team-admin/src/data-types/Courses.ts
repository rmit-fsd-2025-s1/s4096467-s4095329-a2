import { User } from "./User"

export interface Courses{
    class_code: string,
    subject_name: string,
    lecturers?: User[],
    tutors?: TutorLink[]
}

export interface TutorLink{
    email: string,
    class_code: string,
    role_name: string,
    accepted: boolean,
    active_tutore: boolean,
    ranking: number,
    user: User
}

export interface UpdateCourses{
    success: boolean,
    return: Courses[]
}

export interface UpdateCoursesReturn{
    success: boolean,
    courseReturn: Courses[],
    lectureReturn: User[]
}