import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import Diaporama from "./Diaporama";
import { motion } from "framer-motion";

const Activite = ({ activ, accueil }) => {
  const [dialog, setDialog] = useState();
  const [width, setWidth] = useState(document.body.offsetWidth);
  const showDialog = (activity) => {
    setDialog(<Diaporama activ={activity} hide={setDialog} />);
  };
  useEffect(() => {
    return () => {
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
      });
    };
  }, []);
  return (
    <motion.div
      className="actcard"
      initial={{ scale: 0, y: 200, opacity: 0 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 50,
        duration: 0.2,
      }}
    >
      <Card
        sx={{
          maxWidth: 345,
          bgcolor: "transparent",
          backdropFilter: "blur(3px)",
          boxShadow: "2px 2px 15px #6091A5",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: accueil ? (width > 1590 ? 345 : 260) : 345,
            height: 160,
          }}
          image={activ.images[0] || "images/logo_APDIP.png"}
          alt={activ.title}
        />
        <CardContent sx={{ bgcolor: "transparent" }}>
          <Typography gutterBottom variant="h5" component="div">
            {activ.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activ.description.substr(0, 30) + "..."}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => showDialog(activ)}>
            More...
          </Button>
        </CardActions>
      </Card>
      {dialog}
    </motion.div>
  );
};

export default Activite;
