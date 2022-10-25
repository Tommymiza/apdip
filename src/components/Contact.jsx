import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SendRounded } from "@mui/icons-material";
import "../style/Contact.scss";
import { countries } from "../firebase/CountryCodes";
import { about } from "../firebase/about";
import { motion } from "framer-motion";

const Contact = () => {
  const abt = about.getPostInstance();
  const [num, setNum] = useState(261);
  const [progress, setProgress] = useState(false);
  const send = (e) => {
    e.preventDefault();
    setProgress(true);
    const form = document.getElementById("contacter");
    const name = form.name.value;
    const email = form.email.value;
    const tel = parseInt(num.toString() + form.num.value.toString());
    const message = form.message.value;
    if (email) {
      abt
        .addMessage({
          name: name,
          email: email,
          tel: tel,
          message: message,
          status: false,
        })
        .then(() => {
          setProgress(false);
          form.name.value = "";
          form.email.value = "";
          form.num.value = "";
          form.message.value = "";
        });
    } else {
      abt
        .addMessage({
          name: name,
          tel: tel,
          message: message,
          status: false,
        })
        .then(() => {
          setProgress(false);
          form.name.value = "";
          form.num.value = "";
          form.message.value = "";
        });
    }
  };
  useEffect(() => {
    document.title = "Contact | Apdip";
  }, []);
  return (
    <motion.div
      style={{ marginTop: "150px" }}
      id="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <form id="contacter" onSubmit={send}>
        <h2
          style={{
            fontFamily: "var(--fontText)",
            alignSelf: "flex-start",
          }}
        >
          Nous contacter:
        </h2>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "400px",
            }}
          >
            <TextField
              label="Name:"
              name="name"
              required
              InputLabelProps={{
                style: {
                  color: "rgb(255, 255, 255)",
                },
              }}
              sx={{ width: 300 }}
            />
            <TextField
              label="Email:"
              name="email"
              type={"email"}
              InputLabelProps={{
                style: {
                  color: "rgb(255, 255, 255)",
                },
              }}
              sx={{ width: 300 }}
            />
            <Autocomplete
              id="country-select-demo"
              sx={{ width: 300 }}
              options={countries}
              autoHighlight
              getOptionLabel={(option) => option.label}
              onChange={(e, newValue) => {
                if (newValue) {
                  setNum(newValue.phone);
                } else {
                  setNum(261);
                }
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    alt=""
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a country"
                  InputLabelProps={{
                    style: {
                      color: "rgb(255, 255, 255)",
                    },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password",
                  }}
                  required
                />
              )}
            />
            <TextField
              placeholder={"+" + num}
              type={"number"}
              required
              sx={{ width: 300 }}
              name="num"
            />
          </div>
          <div
            id="messageContainer"
            style={{
              alignSelf: "flex-start",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "30px",
            }}
          >
            <TextField
              label="Message:"
              multiline
              required
              InputLabelProps={{
                style: {
                  color: "rgb(255, 255, 255)",
                },
              }}
              minRows={12}
              sx={{ minWidth: 345 }}
              name="message"
            />
          </div>
        </div>
        <div>
          <LoadingButton
            startIcon={<SendRounded />}
            loading={progress}
            loadingIndicator={<CircularProgress color="primary" size={16} />}
            type="submit"
          >
            Envoyer
          </LoadingButton>
        </div>
      </form>
    </motion.div>
  );
};

export default Contact;
