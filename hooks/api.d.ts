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
