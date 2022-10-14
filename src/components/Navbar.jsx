import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../style/Navbar.scss";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { WidgetsRounded, WidgetsOutlined } from "@mui/icons-material";

const Navbar = () => {
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    return () => {
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
        setOpen(false);
      });
    };
  }, []);
  return (
    <div id="navbar">
      <div id="logo">
        <img src="/images/logo_APDIP.png" alt="logo" />
        <h2>APDIP</h2>
      </div>
      <nav>
        {width >= 750 ? (
          <ul>
            <NavLink to={"/"} end>
              <li>Accueil</li>
            </NavLink>
            <NavLink to={"/dashboard"}>
              <li>Admin</li>
            </NavLink>
            <NavLink to={"/list"}>
              <li>Activités</li>
            </NavLink>
            <NavLink to={"/partenaire"}>
              <li>Partenaires</li>
            </NavLink>
            <NavLink to={"/about"}>
              <li>Nous contacter</li>
            </NavLink>
          </ul>
        ) : (
          <ul>
            {open ? (
              <IconButton size="medium" className="btnmenu">
                <WidgetsRounded sx={{ width: 32, height: 32 }} />
              </IconButton>
            ) : (
              <IconButton
                size="medium"
                className="btnmenu"
                onClick={handleClick}
              >
                <WidgetsOutlined sx={{ width: 32, height: 32 }} />
              </IconButton>
            )}

            <Menu
              anchorEl={document.querySelector(".btnmenu")}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  mt: 1.5,
                  bgcolor: "transparent",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0px 0px 15px #6091A5",
                }
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <NavLink to={"/"} end>
                  Accueil
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={"/dashboard"} end>
                  Admin
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={"/list"}>
                  Activités
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={"/partenaire"}>
                  Partenaires
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={"/contact"}>
                  Nous contacter
                </NavLink>
              </MenuItem>
            </Menu>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
