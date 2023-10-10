import { Card } from "@mui/material";
import axios from "axios";
import React, { forwardRef, useEffect, useState } from "react";

const Item = forwardRef((props, ref) => {
  const { withOpacity, isDragging, style, cardData, ...rest } = props;
  console.log("props", props);
  const base_url = "http://192.168.2.109:9000";
  const [form, setForm] = useState([]);
  const [uid, setUid] = useState();

  const inlineStyles = {
    opacity: withOpacity ? "0.5" : "1",

    transformOrigin: "50% 50%",
    height: "240px",
    width: "240px",
    borderRadius: "10px",
    cursor: isDragging ? "grabbing" : "grab",
    backgroundColor: "#81888f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: isDragging
      ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
      : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
    transform: isDragging ? "scale(1.05)" : "scale(1)",
    ...style,
  };

  const shownotes = () => {
    axios.get(`${base_url}/list/content`).then((response) => {
      const data = response.data.Details;

      setForm(data);
    });
  };

  useEffect(() => {
    shownotes();
  }, []);
  console.log("form", form);

  return (
    <>
      <div ref={ref} {...rest}>
        {/* <div sx={{ maxWidth: 345 }} style={inlineStyles}> */}
        {form.map((data) => {
          return (
            <div sx={{ maxWidth: 345 }} style={inlineStyles}>
              {data.id}
            </div>
          );
        })}
        {/* </div> */}
      </div>
    </>
  );
});

export default Item;
