import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    exists: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  password: {
    exists: {
      errorMessage: "Password is required",
    },
  },
});
