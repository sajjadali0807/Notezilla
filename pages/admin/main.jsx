import React, { useEffect, useState } from "react";
import MiniDrawer from "../components/header";
import BasicModal from "../components/modal";

const Main = () => {
  const [form, setForm] = useState({
    title: "",
    notes: "",
  });

  return (
    <>
      <div className="header">
        <MiniDrawer />
      </div>
    </>
  );
};

export default Main;
