import React, {useState, useMemo} from "react";

const Btn = ({ text, icon }) => {
    const [isHover, setHover] = useState(false)
  const style = useMemo(()=>{return {
    background: "rgba(25,25,21,0.5)",
    boxShadow:isHover && "0 0 10px black",
    transition: "0.2s",
    color: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "20px",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "7px",
    fontFamily: "var(--fontText)",
    backdropFilter: "blur(1px)"
  }}, [isHover])
  return (
    <button style={style} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {icon} {text}
    </button>
  );
};

export default Btn;
