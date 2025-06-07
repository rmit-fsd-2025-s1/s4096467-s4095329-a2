export interface Certifications{
    certification_key?: number,
    certification: string
}

export interface Educations{
    education_key?: number,
    education: string
}

export interface Languages{
    language_key?: number,
    language: string
}

export interface Previous_Roles{
    role_key?: number
    prev_role: string
}

export interface Skills{
    skill_key?: number
    skill: string
}

export interface UserCred{
    email: string,
    password: string
}

export interface User{
    email: string,
    full_name?: string,
    password?: string,
    role?: string,
    availability?: string,
    summary?: string,
    active?: boolean,
    certifications: Certifications[],
    educations: Educations[],
    languages: Languages[],
    previous_roles: Previous_Roles[],
    skills:Skills[]
}