import React from "react"
import he from "he"
import {nanoid} from "nanoid"


export default function Questions(props) {

    function htmlOptions(options) {
        options = options.map(option => {
            if (props.checked) {
                if (he.decode(option) === he.decode(props.correct_answer)) {
                    return (
                        <button key={nanoid()} className="correct">{he.decode(option)}</button>
                    )
                } else if ((props.selected.find(obj => obj.id === props.id).select === option) && (props.selected.find(obj => obj.id === props.id).select !== he.decode(props.correct_answer))) {
                    return (
                    <button key={nanoid()} className="incorrect">{he.decode(option)}</button>
                    )
                } else {
                    return (
                    <button key={nanoid()} className="faded">{he.decode(option)}</button>
                    )
                }
            } 
            
            else {
                if (props.selected.find(obj => obj.id === props.id).select === he.decode(option)) {
                return (
                    <button key={nanoid()} className="selected" onClick={updateAnswer}>{he.decode(option)}</button>
                )
            } else {
                return (
                    <button key={nanoid()} onClick={updateAnswer}>{he.decode(option)}</button>
                )
            }
            }
            
        })
          return options
    }
    
    function updateAnswer(event) {
        props.update(props.id, event.target.innerText, props.correct_answer)
    }

    return (
        <main>
            <h2>{he.decode(props.question)}</h2>
            <div className="question-container">{htmlOptions(props.options)}</div>
            <h4>Correct answers: {props.correct_answer}</h4>
            <h4>Selected answers: {props.selected.find(obj => obj.id === props.id).select}</h4>
            <hr />
        </main>
    )
}