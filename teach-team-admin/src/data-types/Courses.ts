import { User } from "./User"

export interface Courses{
    class_code: string,
    subject_name: string,
    lecturers?: User[]
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