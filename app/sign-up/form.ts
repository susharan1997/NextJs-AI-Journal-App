import * as yup from "yup";

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be atleast 2 characters")
    .max(50, "Name canot exceed 50 characters")
    .required("Name is required!"),

  email: yup
    .string()
    .email("Invalid email address!")
    .required("Email is required!"),

  password: yup
    .string()
    .min(6, "Password must contain a minimum of 6 characters")
    .matches(/[a-z]/, "Password must contain atleast 1 lowercase letter")
    .matches(/[A-Z]/, "Password must contain atleast 1 uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain atleast 1 special character"
    )
    .matches(/[0-9]/, "Password must contain atleast 1 uppercase letter")
    .required("Please enter a password!"),

  retypePassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please re-type the password"),
});
