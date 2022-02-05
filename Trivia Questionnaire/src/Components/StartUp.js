import React from "react"

export default function StartUp(props) {
    return (
            props.questions.length > 0 && 
            <div className="startup">
                <h1 className="startup-title">Quizzical</h1>
                <h3 className="startup-desc">Some description if needed</h3>
                <button className="startup-button" onClick={props.start}>Start Quiz</button> 
            </div>
    )
}