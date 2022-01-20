import React from "react"

export default function Info(props) {
  const [mOver, setMOver] = React.useState(false)
  


  return (
    <div>
      <h3 className="popup-container" onMouseOver={() => setMOver(true)} onMouseLeave={() => setMOver(false)}>{props.rolls === 0 ? "?" : props.rolls}</h3>
      {mOver && 
      <div className="popup">
        <h3>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</h3>
      </div>  
      }
    </div>
  )
}


