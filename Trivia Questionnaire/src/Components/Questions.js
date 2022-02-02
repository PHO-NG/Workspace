import React from "react"
import he from "he"
import {nanoid} from "nanoid"

export default function Questions(props) {
    const [questions, setQuestions] = React.useState([])


    
    let answers = []
    answers.push(he.decode(props.correct_answer))
    for (let i=0; i < props.incorrect_answers.length; i++) {
        answers.push(he.decode(props.incorrect_answers[i]))
    }

    function randomise(arr) {
        //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#:~:text=209-,You,-can%20do%20it
        if (props.type !== "boolean") {
            arr = arr
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
        } else {
            arr = ["True", "False"]
        }
        

        arr =   arr.map(ans => (
            <button key={nanoid()} onClick={updateAnswer}>{ans}</button>
        ))
        setQuestions(arr)
    }
    
    React.useEffect(() => {
        randomise(answers)
    }, [])

    React.useEffect(() => {
        if (props.checked) {
            if (props.selected.find(data => data.id === props.id).select === props.correct_answer) {
                console.log("CORRECT")
            } else {
                console.log("WRONG")
            }
        }
        
    }, [props.checked])



    function updateAnswer(event) {
        props.updateSelected(props.id, event.target.innerText)
    }

    
    return (
        <main>
            <h1>{he.decode(props.question)}</h1>
            {questions}
            <h4>Correct answers: {props.correct_answer}</h4>
            <h4>Current: {props.id}</h4>


            <hr />
        </main>
    )
}

/*
{
    "response_code":0,
    "results":[{
        "category":"Entertainment: Video Games",
        "type":"multiple",
        "difficulty":"hard",
        "question":"In World of Warcraft lore, who organized the creation of the Paladins?",
        "correct_answer":"Alonsus Faol",
        "incorrect_answers":["Uther the Lightbringer","Alexandros Mograine","Sargeras, The Daemon Lord"]
}
*/