import React, { useEffect } from "react";
import { ErrorOutlineRounded } from "@mui/icons-material";

const Test = () => {
  useEffect(() => {
    console.log("Hola");
  }, []);
  return (
    <div
      id="notfound"
      exit={{ opacity: 0, y: 100, transition: { duration: 1 } }}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ErrorOutlineRounded sx={{ width: 100, height: 100 }} />
      <h1>404, Page not Found</h1>
    </div>
  );
};

export default Test;
