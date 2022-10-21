import React, { useState, useEffect } from "react";
import { Dialog, IconButton } from "@mui/material";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  Close,
} from "@mui/icons-material";
import "../style/Diapo.scss";

const DialogAxe = ({ axe, hide }) => {
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
      maxWidth={"lg"}
      onBackdropClick={() => {
        hide();
      }}
      fullScreen={width < 450 ? true : false}
    >
      <div className="diaporama">
        {axe.img && (
          <div className="diapo">
            {axe.img.map((item, index) => (
              <div key={index}>
                <img src={"./images/" + item + ".png"} alt={axe.title} />
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
              onClick={() => slideleft(axe.img.length)}
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
        )}
        <div
          className={axe.img ? "descri" : ""}
          style={{
            fontFamily: "var(--fontText)",
            flexDirection: "column",
            alignItems: "flex-start",
            display: "flex",
          }}
        >
          <h2>{axe.title}</h2>
          <h4>Les activités:</h4>
          <p>{axe.act}</p>
          <h4>Les objectifs:</h4>
          <p>{axe.obj}</p>
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

export default DialogAxe;
