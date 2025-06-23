// types/user.ts

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    age: string,
    height: string,
    weight: string,
    ethnicity: string,
    sex: string,
    medications: Array;
    createdAt?: Date;
    updatedAt?: Date;
}