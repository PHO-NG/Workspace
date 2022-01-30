import React from "react"
import he from "he"

export default function Questions(props) {

    // function handleChange(event) {
    //     const {name, value} = event.target
    //     setMeme(prevMeme => ({
    //         ...prevMeme,
    //         [name]: value
    //     }))
    // }
    
    let answers = []
    if (props.type !== "boolean") {

        answers.push(he.decode(props.correct_answer))
        for (let i=0; i < props.incorrect_answers.length; i++) {
            answers.push(he.decode(props.incorrect_answers[i]))
        }

        //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#:~:text=209-,You,-can%20do%20it
        answers = answers
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            
    } else {
        answers = ["True", "False"]
    }
    
    return (
        <main>
            <h1>{he.decode(props.question)}</h1>
            <h3>{answers}</h3>
            <h4>{props.correct_answer}</h4>
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