import * as React from "react";
import { styled } from "@mui/material/styles";
import { router } from "next/router";
import IconButton from "@mui/material/IconButton";

import * as yup from "yup";
import { useFormik } from "formik";
import { TextField } from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handlealreadylogin = () => {
    router.push("/auth/login");
  };
  return (
    <>
      <div className="main-container">
        <div className="signup-wrapper">
          <div className="signup-container">
            <h1>Enter Your Details</h1>
            <TextField
              id="outlined-basic"
              label="User Name"
              variant="outlined"
              multiline
              margin="normal"
              fullWidth
              name="username"
              type="text"
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              multiline
              margin="normal"
              fullWidth
              name="email"
              type="text"
            />
            <TextField
              id="outlined-basic"
              label="phone No"
              variant="outlined"
              multiline
              margin="normal"
              fullWidth
              name="phone"
              type="text"
            />
            <TextField
              id="outlined-basic"
              label="password"
              variant="outlined"
              multiline
              margin="normal"
              fullWidth
              name="password"
              type="text"
            />
            <TextField
              id="outlined-basic"
              label="confirm password"
              variant="outlined"
              multiline
              margin="normal"
              fullWidth
              name="confirm password"
              type="text"
            />
            <div className="signup-btn-wrapper">
              <button className="signup-btn mt-3">Sign Up</button>
            </div>
            <div className="already-btn-wrapper ">
              <p onClick={handlealreadylogin}>Already Have An Account Login</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
