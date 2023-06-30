type ApiResponse = {
  success: boolean;
  error:
    | any
    | {
        message: string;
        description: string;
      };
  data: any;
};

type User = {
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
};

type Role = "ADMIN" | "USER" | "MODERATOR";

type APIResponseUser = {
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
};
