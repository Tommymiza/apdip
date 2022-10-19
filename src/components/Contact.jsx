import React,{useState} from "react";

const Contact = () => {
  const [text,setText] = useState(["fefez", "kfjezlkfj"]);
  const add = () => {
    setText([...text, "rer"])
  };
  return (
    <div style={{ marginTop: "150px" }}>
      {text.length !== 0 && text.map((i,index) => (
        <h2 key={index}>{i}</h2>
      ))}
      <button onClick={add}>Add</button>
    </div>
  );
};

export default Contact;
