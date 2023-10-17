import { Card } from "@mui/material";
import axios from "axios";
import React, { forwardRef, useEffect, useState } from "react";
import options from "../../public/options.png";
import Image from "next/image";

const Item = forwardRef((props, ref) => {
  const {
    withOpacity,
    isDragging,
    style,
    cardData,
    title,
    id,
    color,
    colour,
    ...rest
  } = props;
  console.log("propsddd", id);
  const base_url = "http://192.168.2.109:9000";
  const [form, setForm] = useState([]);
  const [uid, setUid] = useState();
  const bgcolors = ["#ffffff", "#a29bfe", "#ffeaa7", "#55efc4", "#DFCCFB"];

  const inlineStyles = {
    opacity: withOpacity ? "0.1" : "1",
    transformOrigin: "50% 50%",
    height: "440px",
    width: "250px",
    borderRadius: "10px",
    cursor: isDragging ? "grabbing" : "grab",
    backgroundColor: colour,
    // justifyContent: "center",
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

  return (
    <>
      <div ref={ref} {...rest}>
        <div sx={{ maxWidth: 345 }} style={inlineStyles}>
          <div className="options mt-2">
            <b>
              <p>Note ID:{id.id}</p>
            </b>
            <Image src={options} alt="menu" />
          </div>
          <div className="mycard ">
            <br />
            <h3>{id.title}</h3>
            <br />
            {id.content}
          </div>
        </div>
      </div>
    </>
  );
});

export default Item;
