import * as Yup from "yup";
import { useFormik } from "formik";
import "./Register.scss";
import React from "react";
import useUserStore from "../store/user";
import NotLoggedIn from "../components/NotLoggedIn";
import TagsInput from "../components/TagsInput";

const UpdateSchema = Yup.object().shape({
  name: Yup.string().min(5, "Name must be 5 characters at minimum"),
});

const UpdateBio = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const updateBio = useUserStore((state) => state.updateBio);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const [interests, setInterests] = React.useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: UpdateSchema,
    onSubmit: (values) => {
      setSuccess(updateBio({ setError, interests, name: values.name }));

      if (success) {
        // navigate("/bio");
        console.log(`updated`);
      }
    },
  });

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return (
    <div className="register">
      <h1>Update Bio</h1>

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

        <TagsInput setTags={setInterests} tags={interests} />

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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UpdateBio;
