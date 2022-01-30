import React from "react"

export default function StartUp(props) {
    return (
        <div>
            <h1>Quizzical</h1>
            <h3>Some description if needed</h3>
            <button onClick={props.start}>Start Quiz</button>
        </div>
    )
}