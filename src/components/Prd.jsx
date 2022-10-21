import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  ThemeProvider,
  TextField,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  VisibilityRounded,
  BorderColorRounded,
  DeleteSweepRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import PrdDiapo from "./PrdDiapo";
import { theme } from "./theme";
import { produit } from "../firebase/produit";

const Prd = ({ prod, connected, set }) => {
  const [dialog, setDialog] = useState();
  const [progress, setProgress] = useState(false);
  const [progress1, setProgress1] = useState(false);
  const prd = produit.getPostInstance();

  const showDialog = (prod) => {
    setDialog(<PrdDiapo prod={prod} hide={setDialog} />);
  };
  const updateProd = (id) => {
    var stock = parseInt(document.getElementById("stock" + id).value);
    const prix = parseInt(document.getElementById("prix" + id).value);
    if (!isNaN(prix)) {
      if (isNaN(stock)) {
        stock = 0;
      }
      setProgress(true);
      prd.updateProduit({ stock: stock, prix: prix }, id).then(() => {
        prd.list(set).then(() => {
          setProgress(false);
        });
      });
    }
  };
  const deleteProd = (prod) => {
    setProgress1(true);
    prd.deleteProduit(prod.id, prod.filière, prod.files).then(() => {
      prd.list(set);
    });
  };
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
            width: 345,
            height: 200,
          }}
          image={prod.photo[0] || "images/logo_APDIP.png"}
          alt={prod.files[0]}
        />
        <CardContent
          sx={{ bgcolor: "transparent", fontFamily: "var(--fontText)" }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {prod.filière}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {connected ? (
              <>
                <p>Stock: </p>
                <TextField
                  id={"stock" + prod.id}
                  defaultValue={prod.stock}
                  type="number"
                  InputProps={{
                    style: {
                      height: "40px",
                      width: "100px",
                    },
                  }}
                />
                <p style={{ marginLeft: "10px" }}>{prod.unit}</p>
              </>
            ) : (
              <p
                style={{
                  margin: 0,
                  color: prod.stock !== 0 ? "black" : "rgb(228, 93, 93)",
                }}
              >
                {"Stock: " + prod.stock + " " + prod.unit}
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {connected ? (
              <>
                <p>Prix: </p>
                <TextField
                  id={"prix" + prod.id}
                  type="number"
                  defaultValue={prod.prix}
                  InputProps={{
                    style: {
                      height: "40px",
                      width: "115px",
                    },
                  }}
                />
                <p style={{ marginLeft: "10px" }}>{" Ar/" + prod.unit}</p>
              </>
            ) : (
              <p style={{ margin: 0 }}>
                {"Prix: " + prod.prix + " Ar/" + prod.unit}
              </p>
            )}
          </div>
        </CardContent>
        <CardActions>
          <ThemeProvider theme={theme}>
            <Button
              endIcon={<VisibilityRounded />}
              size="medium"
              onClick={() => showDialog(prod)}
            >
              Voir
            </Button>
            {connected && (
              <>
                <LoadingButton
                  endIcon={<BorderColorRounded />}
                  size="medium"
                  onClick={() => updateProd(prod.id)}
                  loading={progress}
                  loadingIndicator={
                    <CircularProgress color="primary" size={16} />
                  }
                >
                  Modifier
                </LoadingButton>
                <LoadingButton
                  endIcon={<DeleteSweepRounded />}
                  size="medium"
                  onClick={() => deleteProd(prod)}
                  loading={progress1}
                >
                  Effacer
                </LoadingButton>
              </>
            )}
          </ThemeProvider>
        </CardActions>
      </Card>
      {dialog}
    </motion.div>
  );
};

export default Prd;
