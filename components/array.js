import React, { useState, useEffect } from "react";

const Arrayjs = () => {
  const [inDefault, setInDefault] = useState(["a", "b", "c", "d", "e"]);
  const [x, setx] = useState(["a", "c", "d"]);
  const [arraystatut, setArrayStatut] = useState([]);
  const [temparraystatut, setTemparraystatut] = useState("");
  const [temps, setTemp] = useState([]);

  useEffect(() => {
    let inner = document.querySelector(".arraystatut");
    setArrayStatut(JSON.stringify(x));
  }, []);

  Array.prototype.diff = function(arr3){
    return this.filter(j => !arr3.includes(j))
}

  const isSelected = (letter) => {
      if(x.some(element => element === letter)){
          return true
      }else {
         return false
      }
  }
  const selected = (letter, i) => {
    // if element exit on array
    if(x.some(element => element === letter)) {

    // if item exist, i want remove it we get element not selected
    let exclude = inDefault.diff(x)
    // we concat element not selectet with element to remove it
    exclude = [...exclude, letter]
    console.log("exclude", exclude)

    //we keep only element selected
    let newX = inDefault.filter((z) => !exclude.includes(z))

    console.log("newX", newX)
    setTemparraystatut(JSON.stringify(newX));

    setx(newX)

    }else {
        let temporar = [...x]
        temporar.push(letter)

        setTemp(temporar);
        setx(temporar)
        setTemparraystatut(JSON.stringify(temporar));
    }

    isSelected(letter)
  };

  return (
    <>
      {inDefault.map((item, i) => (
        <div
        style={{fontWeight: isSelected(item) ? "bold" : "normal", fontSize: "30px"}}
          onClick={() => {
            console.log("item");
            selected(item, i);
          }}
          key={i}
        >
          {item}
        </div>
      ))}
      <div className="arrayVisible">{arraystatut}</div>
      <div className="tempVisible">{temparraystatut}</div>
    </>
  );
};

export default Arrayjs;
