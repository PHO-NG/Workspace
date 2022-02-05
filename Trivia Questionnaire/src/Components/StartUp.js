import React from "react"

export default function StartUp(props) {
    return (
            /*---WAITS TILL DATA FROM API HAS BEEN COLLECTED THEN LOADS TO PREVENT ERRORS---*/
            props.questions.length > 0 && 
            <div className="startup">
                <h1 className="startup-title">Quizzical</h1>
                <h3 className="startup-desc">Play now to test your trivia knowledge!</h3>
                <button className="startup-button" onClick={props.start}>Start Quiz</button> 
            </div>
    )
}