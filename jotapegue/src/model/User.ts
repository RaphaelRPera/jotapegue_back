
export enum UserRole {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}


export interface UserInputDTO {
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: UserRole
}

export interface UserInput {
    id: string;
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: UserRole
}


