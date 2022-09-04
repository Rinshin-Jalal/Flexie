import * as Yup from "yup";
import { useFormik } from "formik";
import "./Register.scss";
import React from "react";
import useUserStore from "../store/user";
import LoggedIn from "../components/LoggedIn";
import { useNavigate } from "react-router-dom";

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .required("Password is required"),

  name: Yup.string()
    .min(5, "Name must be 5 characters at minimum")
    .required("Name is required"),
});

const Register = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const register = useUserStore((state) => state.register);
  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      setSuccess(
        register(values.name, values.email, values.password, setError)
      );

      if (success) {
        navigate("/");
      }
    },
  });

  if (isLoggedIn) {
    return <LoggedIn />;
  }

  return (
    <div className="register">
      <h1>Sign Up</h1>

      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="name"
          placeholder="Enter your name..."
          onChange={formik.handleChange}
          value={formik.values.name}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder="Enter your email..."
          onChange={formik.handleChange}
          value={formik.values.email}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password..."
          onChange={formik.handleChange}
          value={formik.values.password}
        />

        <p className="error">
          {formik.errors.email && <span>{formik.errors.email}</span>}
          {formik.errors.password && (
            <>
              <br />
              <span>{formik.errors.password}</span>
            </>
          )}
          {formik.errors.name && (
            <>
              <br />
              <span>{formik.errors.name}</span>
            </>
          )}
          {error && (
            <>
              <br />
              <span>{error}</span>
            </>
          )}
        </p>

        <button type="submit">Sign Up</button>
      </form>

      <p className="question1">
        Have an account? <a href="/login">Sign In</a>
      </p>
    </div>
  );
};

export default Register;
