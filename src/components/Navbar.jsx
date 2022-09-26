import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Grid,
  IconButton,
  Menu,
  ListItemIcon,
  MenuItem,
  Divider,
  Typography,
  
} from "@mui/material";
import logo from "../images/logo.png";
import * as Im from "@mui/icons-material";
import "../style/Navbar.scss";

const Navbar = () => {
  const [anchorEl, setAnchorEL] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEL(null);
  };
  const deluser = () => {
    document.cookie = "accessKey=; expires=01 Oct 1970 00:00:00 GMT";
  };
  useEffect(() => {
    document.getElementById("menuopen").addEventListener("click", (e) => {
      setAnchorEL(e.currentTarget);
    });
  }, []);

  return (
    <div id="navbar">
      <Grid
        container
        direction={"row"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        wrap={"nowrap"}
      >
        <Grid item>
          <Avatar
            src={logo}
            sx={{
              width: 100,
              height: 100,
              boxShadow: "7px 5px 15px",
            }}
          ></Avatar>
        </Grid>
        <Grid item>
          <Typography id="Title">
            <span>A</span>
            ssociation des{" "}
            <span>P</span>
            aysans pour le{" "}
            <span>D</span>
            éveloppement{" "}
            <span>I</span>
            nter–
            <span>P</span>
            rofessionnels
          </Typography>
        </Grid>
        <Grid item>
          <IconButton id="menuopen">
            <Im.Menu />
          </IconButton>
        </Grid>
      </Grid>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link to={"/"} style={{ display: "flex", alignItems: "center" }}>
            <Im.HomeWorkRounded sx={{ mr: "10px" }} />
            <span>Accueil</span>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to={"/list"} style={{ display: "flex", alignItems: "center" }}>
            <Im.DashboardRounded sx={{ mr: "10px" }} />
            <span>Activité</span>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Im.Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={deluser}>
          <ListItemIcon>
            <Im.Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Navbar;
