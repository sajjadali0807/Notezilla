import { router } from "next/router";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import { useFormik } from "formik";
import React, { useState } from "react";

const Login = () => {
  const [userdetails, setuserdetais] = useState({ username: "", password: "" });

  const handlesignup = () => {
    router.push("/components/signup");
  };
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("User Name is required!"),

      password: Yup.string().required("Please enter your password"),
    }),
    onSubmit: (e) => {
      const currentdetails = {
        username: e?.username,
        password: e?.password,
      };
      console.log("currentdetails", currentdetails);
      setuserdetais(currentdetails);
      const detailsjson = JSON.stringify(currentdetails);
      sessionStorage.setItem("currentdetailsdata", detailsjson);
      router.push("/admin/main");
    },
  });
  return (
    <div className=" main-container">
      <div className="login-wrappper">
        <h1>Welcome Back !!</h1>
        <TextField
          id="standard-basic"
          label="User Name"
          variant="standard"
          multiline
          margin="normal"
          fullWidth
          name="username"
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.username}
          error={formik.touched.username}
          helperText={<>{formik.touched.username && formik.errors.username}</>}
        />
        <TextField
          id="standard-basic"
          label="Password"
          variant="standard"
          multiline
          margin="normal"
          fullWidth
          name="password"
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.touched.password}
          helperText={formik.errors.password}
        />

        <div className="forgot-pwd mt-2">
          <a>Forgot Password ?</a> <br />
        </div>
        <div className="login-btn-wrapper">
          <button
            onClick={(e) => {
              formik.handleSubmit();
              console.log(e, "logg");
            }}
            className="lg-btn mt-4"
          >
            Log In
          </button>
        </div>
        <div className="signup-link mt-3">
          <p onClick={handlesignup}>Don't have an account ?</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
