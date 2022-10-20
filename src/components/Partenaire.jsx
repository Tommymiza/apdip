import React from "react";
import "../style/Partenaire.scss";
import { partenariat } from "../firebase/partenaire";
import { motion } from "framer-motion";

const Partenaire = () => {
  return (
    <motion.div
      id="partenaire"
      initial={{opacity: 0}}
      animate={{opacity: 1, transition: {duration: 0.5}}}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <h2>Nos partenaires:</h2>
      <div className="row-container">
        {partenariat.map((item) => (
          <motion.div
            className="cardpart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1,transition:{
              duration: 0.4,
            }}}
            
            key={item.id}
            onClick={() => {
              window.open(item.link);
            }}
          >
            <img src={"/images/" + item.img} alt={item.name} />
            <div className="back"></div>
            <div className="content">
              <h3>{item.name}</h3>
              <p>{item.descri}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Partenaire;
