import { Request } from "express";
export interface createUser {
  name: string;
  email: string;
  password: string;
}

export interface createUserRequest extends Request {
  body: createUser;
}

export interface loginUserRequest extends Request {
  body: Omit<createUser, "name">;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
  };
}

interface SubInAuth {
  auth: {
    sub: string;
  };
}

export interface BookCreateRequest extends Request, SubInAuth {
  body: {
    title: string;
    author: string;
    genre: string;
    createdBy: string;
  };
}

export interface DeleteBookRequest extends Request, SubInAuth {}
