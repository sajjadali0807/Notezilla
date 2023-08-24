import React, { useEffect, useState } from "react";
import MiniDrawer from "../components/Layout/userLayout";
import UserLayout from "../components/Layout/userLayout";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

const Main = () => {
  const [form, setForm] = useState([]);

  const shownotes = () => {
    axios.get("http://192.168.2.109:9000/list/content").then((e) => {
      console.log(e.data.Details, "hi");
      setForm(e?.data.Details);
    });
  };

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  useEffect(() => {
    shownotes();
  }, []);

  return (
    <>
      <div className="notes-wrapper">
        {form?.map((e, key) => {
          return (
            <>
              <Card
                className="mx-3"
                sx={{
                  minWidth: 250,
                  maxWidth: 300,
                  maxHeight: 400,
                  padding: "20px",
                  backgroundImage:
                    "linear-gradient(to bottom right, #FDFCFB, #E2D1C3)",
                }}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    <b> ID:{e?.id}</b>
                  </Typography>
                  <Typography variant="h3" component="div">
                    {e?.title}
                  </Typography>
                  <Typography variant="body2">
                    <b>{e?.content}</b>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Delete</Button>
                </CardActions>
              </Card>
            </>
          );
        })}
      </div>
    </>
  );
};

export default Main;
Main.getLayout = (page) => <MiniDrawer>{page}</MiniDrawer>;
