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
  role: "ADMIN" | "USER" | "MODERATOR";
};
