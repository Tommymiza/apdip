import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/Navbar.scss";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { WidgetsRounded, WidgetsOutlined } from "@mui/icons-material";

const Navbar = () => {
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menu = [
    {
      label: "Accueil",
      link: "/",
    },
    {
      label: "Personnel",
      link: "/dashboard",
    },
    {
      label: "Activités",
      link: "/list",
    },
    {
      label: "Produits",
      link: "/product",
    },
    {
      label: "Partenaires",
      link: "/partenaire",
    },
    {
      label: "Contact",
      link: "/contact",
    },
  ];
  const toHome = () => {
    navigate("/");
  };
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(document.body.offsetWidth);
      setOpen(false);
    });
  }, []);
  return (
    <div id="navbar">
      <div id="logo" onClick={toHome}>
        <div>
          <img src="/images/logo_APDIP.png" alt="logo" />
        </div>

        <h2>APDIP</h2>
      </div>
      <nav>
        {width >= 950 ? (
          <ul>
            {menu.map((i) => (
              <NavLink to={i.link} key={i.label} end={i.link === "/"}>
                <li>{i.label}</li>
              </NavLink>
            ))}
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
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {menu.map((i) => (
                <MenuItem key={i.label}>
                  <NavLink to={i.link} end={i.link === "/"}>
                    {i.label}
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
