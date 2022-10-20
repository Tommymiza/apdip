import React, { useContext, useEffect, useState } from "react";
import Prd from "./Prd";
import { ActContext } from "../App";
import {
  Card,
  Skeleton,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import app from "../firebase/db";

const Product = () => {
  const { produits, setProduits, pret } = useContext(ActContext);
  const [connected, setConnected] = useState(false);
  const skeleton = [0, 1, 2, 3];
  useEffect(() => {
    return () => {
      setConnected(false);
      const tempdata = getFirestore(app);
      const key = document.cookie;
      const keyitems = key.split(";");
      const keyitem = keyitems[0].split("=");
      const admins = collection(tempdata, "admins");
      getDocs(admins)
        .then((res) => {
          res.docs.forEach((doc) => {
            if (keyitem[1] === doc.id) {
              setConnected(true);
            }
          });
        })
        .catch((err) => {
          alert(err);
        });
    };
  }, []);
  return (
    <>
      {pret ? (
        <motion.div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            marginTop: "150px",
            justifyContent: "space-evenly",
            gap: "10px",
            marginBottom: "50px",
            minHeight: "calc(100vh - 200px)"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {produits &&
            produits.map((prod) => (
              <Prd
                key={prod.id}
                connected={connected}
                set={setProduits}
                prod={prod}
              />
            ))}
        </motion.div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            marginTop: "150px",
            justifyContent: "space-evenly",
            gap: "10px",
          }}
        >
          {skeleton.map((i) => (
            <motion.div
              key={i}
              className="actcard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{ maxWidth: 345 }} elevation={4}>
                <Skeleton
                  variant={"rectangular"}
                  width={345}
                  height={200}
                ></Skeleton>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <Skeleton
                      width={100}
                      height={20}
                      variant={"rectangular"}
                    ></Skeleton>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Skeleton
                      width={200}
                      height={10}
                      variant={"rectangular"}
                    ></Skeleton>
                    <Skeleton
                      width={200}
                      height={10}
                      variant={"rectangular"}
                    ></Skeleton>
                    <Skeleton
                      width={200}
                      height={10}
                      variant={"rectangular"}
                    ></Skeleton>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">More...</Button>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default Product;
