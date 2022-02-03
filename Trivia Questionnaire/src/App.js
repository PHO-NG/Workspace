import React from "react"
import {nanoid} from "nanoid"
import StartUp from "./Components/StartUp"
import Questions from "./Components/Questions"


export default function App() {
  const [start, setStart] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  
  const [allQuestions, setAllQuestions] = React.useState([])
  const [selected, setSelected] = React.useState([])
  
    
//move questions here and send over to Questions.js via props, to remove randomisation on rerender.

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
        .then(res => res.json())
        .then(data => setAllQuestions(data.results))
  
  }, [])


  function checkAnswers() {
    let checkall = true
    for (let i = 1; i <= selected.length; i++) {
      if (selected.find(select => select.id === i).select === "") {
        checkall = false
        break
      }
    }
    if (checkall) {
      setChecked(true)
    } else {
      alert("Answer all questions to see solution")
    }
    
  }

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  function randomise(rightAnswer, options) {
    if (options.includes(rightAnswer) === false) {
      options.push(rightAnswer)
      //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#:~:text=209-,You,-can%20do%20it
      if (options.length === 2) {
        options = ["True", "False"]
      } else {
        shuffle(options)
      }
    } else {
      if (options.length === 2) {
        options = ["True", "False"]
      }
    return options
    }
  }

  function initialiseStated() {
    for (let i = 1; i <= 5; i++) {
      let temp = {
        id: i,
        select: "",
        correct: ""
      }
      setSelected(prev => [temp, ...prev])
    }
  }

  function updateSelected(id, text, correct) {
    setSelected(prev => prev.map(data => (
      data.id === id ? { ...data, select:text, correct: correct} : data)
    ))  
  }

  
  function score() {
    let mark = 0
    for (let i = 1; i <= allQuestions.length; i++) {

      if (selected.find(question => question.id === i).correct === selected.find(chosen => chosen.id === i).select) {
        mark++
      }
    }
    console.log(allQuestions.length)
    return mark
  }

  function startQuiz() {
    setStart(prev => true)
    initialiseStated()
  }

  function restartPage() {
    window.location.reload();
  }

  let id = 0
  const quiz = allQuestions.map(question => (
      <Questions 
        {...question}
        options= {randomise(question.correct_answer, question.incorrect_answers)}
        key={nanoid()}
        id={++id}
        checked={checked}
        selected={selected}
        update={updateSelected}
      />
      
  ))

  return (
    <div>
    {
      start === false 
      ?
      <div> 
      <StartUp 
        start={startQuiz}
      />
      </div>
      :
      <div>
      {quiz}
      {
      checked === false ? 
      <button onClick={checkAnswers}>Check answers</button> 
      :
      <h3> You got {score()}/5 correct answers <button onClick={restartPage}>Play again</button> </h3>
      }
      </div>
    }
    </div>
  )
}

