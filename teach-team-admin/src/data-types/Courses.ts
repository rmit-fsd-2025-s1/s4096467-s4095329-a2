export interface Courses{
    class_code: string,
    subject_name: string 
}

export interface UpdateCourses{
    success: boolean,
    return: Courses[]
}