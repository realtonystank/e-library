import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    exists: {
      errorMessage: "Name is required",
    },
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Name can contain only alphabets",
    },
  },
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
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 characters",
    },
    matches: {
      options: [/(?=.*[0-9])(?=.*[!@#$%^&*])/],
      errorMessage:
        "Password must contain at least one number and one special character",
    },
  },
});
