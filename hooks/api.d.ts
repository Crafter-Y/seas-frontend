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
  role: Role;
};

type APIResponsePage = {
  pageId: string;
  name: string;
};

type APIResponseColumn = {
  columnId: string;
  name: string;
  type: "POSITION" | "COMMENT";
  pages: string[];
};

type APIResponseDefaultComment = {
  commentId: string;
  comment: string;
};
