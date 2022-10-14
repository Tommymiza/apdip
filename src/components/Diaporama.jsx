import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  Close,
} from "@mui/icons-material";
import "../style/Diapo.scss";

const Diaporama = ({ activ, hide }) => {
  const [slide, setSlide] = useState(0);
  const slideleft = (a) => {
    if (slide > -((a - 1) * 100)) {
      var trsltX = slide - 100;
      setSlide(trsltX);
      document.querySelectorAll(".diapo div").forEach((element) => {
        element.style.transform = `translateX(${trsltX}%)`;
      });
    }
  };
  const slideright = () => {
    if (slide < 0) {
      var trsltX = slide + 100;
      setSlide(trsltX);
      document.querySelectorAll(".diapo div").forEach((element) => {
        element.style.transform = `translateX(${trsltX}%)`;
      });
    }
  };
  return (
    <Dialog
      open={true}
      maxWidth={"lg"}
      onBackdropClick={() => {
        hide();
      }}
    >
      <div className="diaporama">
        <div className="diapo">
          {activ.images.map((item, index) => (
            <div key={index}>
              <img src={item} alt={activ.title} />
            </div>
          ))}
          <IconButton
            onClick={() => slideright()}
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              color: "black",
            }}
          >
            <ChevronLeftRounded />
          </IconButton>
          <IconButton
            onClick={() => slideleft(activ.images.length)}
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              color: "black",
            }}
          >
            <ChevronRightRounded />
          </IconButton>
        </div>
        <div className="descri">
          <h2>{activ.title}</h2>
          <h4>
            {activ.place} le {activ.date}
          </h4>
          <p>{activ.description}</p>
        </div>
        <IconButton
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
          }}
          onClick={() => {
            hide();
          }}
        >
          <Close />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default Diaporama;
