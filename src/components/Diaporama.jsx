import React, { useState, useEffect } from "react";
import { Dialog, IconButton } from "@mui/material";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  Close,
} from "@mui/icons-material";
import "../style/Diapo.scss";

const Diaporama = ({ activ, hide }) => {
  const [slide, setSlide] = useState(0);
  const [width, setWidth] = useState(document.body.offsetWidth);
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
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(document.body.offsetWidth);
    });
  }, []);
  return (
    <Dialog
      open={true}
      maxWidth={"xl"}
      onBackdropClick={() => {
        hide();
      }}
      fullScreen={width < 450 ? true : false}
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
            {activ.place} le {activ.date.substr(8,2) + "/" + activ.date.substr(5,2) + "/" + activ.date.substr(0,4)}
          </h4>
          <h4>Filière : {activ.filière}</h4>
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
