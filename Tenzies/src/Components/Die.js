import React from "react"

export default function Die(props) {
    const styles = {
      backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    let die;
    if (props.value === 1) {
      die = <div className ={`dice-${props.value}`}>
              <span className="dot"></span>
            </div>

    } else if (props.value === 2) {
      die = <div className ={`dice-${props.value}`}>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

    } else if (props.value === 3) {
      die = <div className ={`dice-${props.value}`}>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

    } else if (props.value === 4) {
      die = <div className ={`dice-${props.value}`}>
              <div className="column">
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

              <div className="column">
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>

    } else if (props.value === 5) {
      die = <div className ={`dice-${props.value}`}>
              <div className="column">
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

              <span className="dot"></span>

              <div className="column">
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

            </div>

    } else {
      die = <div className ={`dice-${props.value}`}>
              <div className="column">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

              <div className="column">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
    }

  return (
    <div className ="die" style={styles} onClick={props.toggleHold}>
      {die}
    </div>

  )
}
