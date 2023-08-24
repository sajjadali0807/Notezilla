import React from "react";
import MiniDrawer from "../components/Layout/userLayout";

const Test = () => {
  return <div>Test</div>;
};

export default Test;
Test.getLayout = (page) => <MiniDrawer>{page}</MiniDrawer>;
