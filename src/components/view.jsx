import React from "react";
import { Menu } from "@mui/material";

const View = ({item, close}) => {
  return (
    <Menu
      anchorEl={document.getElementById(item.id)}
      open={true}
      onClose={close}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          mt: 1.5,
          boxShadow: "0px 0px 15px rgb(109, 109, 109)",
          fontFamily: 'var(--fontText)',
          padding: '20px'
        },
      }}
      transformOrigin={{ horizontal: "center", vertical: "top" }}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
    >
        <h4 style={{margin: 0}}>{item.content.name}</h4>
        {item.content.email && <h5 style={{margin: 0}}>{item.content.email}</h5>}
        <p>{item.content.message}</p>
        <h5>tel: {item.content.tel}</h5>
    </Menu>
  );
};

export default View;
