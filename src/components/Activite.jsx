import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  ThemeProvider,
} from "@mui/material";
import Diaporama from "./Diaporama";
import { motion } from "framer-motion";
import { MoreHorizRounded } from "@mui/icons-material";
import { theme } from "./theme";

const Activite = ({ activ, accueil }) => {
  const [dialog, setDialog] = useState();
  const [width, setWidth] = useState(document.body.offsetWidth);
  const showDialog = (activity) => {
    setDialog(<Diaporama activ={activity} hide={setDialog} />);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(document.body.offsetWidth);
    });
  }, []);
  return (
    <motion.div
      className="actcard"
      initial={{ scale: 0, y: 200, opacity: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 50,
        duration: 0.2,
      }}
    >
      <Card
        sx={{
          maxWidth: 345,
          backdropFilter: "blur(10px)",
          boxShadow: "2px 2px 15px #6091A5",
          backgroundColor: "rgba(255,255,255,0.3)",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: accueil ? (width > 1590 ? 345 : 260) : 345,
            height: 200,
            transition: "0.2s",
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
          <ThemeProvider theme={theme}>
            <Button
              endIcon={<MoreHorizRounded />}
              size="small"
              onClick={() => showDialog(activ)}
            >
              More
            </Button>
          </ThemeProvider>
        </CardActions>
      </Card>
      {dialog}
    </motion.div>
  );
};

export default Activite;
