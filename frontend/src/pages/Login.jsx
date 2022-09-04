import React from "react";
import "./Login.scss";
import * as Yup from "yup";
import { useFormik } from "formik";
import useUserStore from "../store/user";
import { useNavigate } from "react-router-dom";
import LoggedIn from "../components/LoggedIn";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const login = useUserStore((state) => state.login);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setSuccess(login(values.email, values.password, setError));

      if (success) {
        navigate("/");
      }
    },
  });

  if (isLoggedIn) {
    return <LoggedIn />;
  }

  return (
    <div className="login">
      <h1>Sign In</h1>

      <form onSubmit={formik.handleSubmit}>
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

          {error && (
            <>
              <br />
              <span>{error}</span>
            </>
          )}
        </p>

        <button type="submit">Sign In</button>
      </form>

      <p className="question">
        Don't have an account? <a href="/register">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
