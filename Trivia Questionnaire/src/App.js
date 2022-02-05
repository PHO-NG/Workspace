import React from "react"
import {nanoid} from "nanoid"
import StartUp from "./Components/StartUp"
import Questions from "./Components/Questions"


export default function App() {
  const [start, setStart] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  
  const [allQuestions, setAllQuestions] = React.useState([])
  const [data, setData] = React.useState([])
  
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
        .then(res => res.json())
        .then(data => setAllQuestions(data.results))
  
  }, [])

  function checkAnswers() {
    let checkall = true
    for (let i = 1; i <= data.length; i++) {
      if (data.find(select => select.id === i).select === "") {
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

  function initialiseData() {
    for (let i = 1; i <= allQuestions.length; i++) {
      let temp = {
        id: i,
        select: "",
        correct: ""
      }
      setData(prev => [...prev, temp])
    }
  }

  function updateSelected(id, selected, correct) {
    setData(prev => prev.map(data => (
      data.id === id ? { ...data, select: selected, correct: correct} : data)
    ))  
  }
  
  function score() {
    let mark = 0
    for (let i = 1; i <= allQuestions.length; i++) {
      if (data.find(question => question.id === i).correct === data.find(chosen => chosen.id === i).select) {
        mark++
      }
    }
    return mark
  }

  function startQuiz() {
    setStart(prev => true)
    initialiseData()
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
        selected={data}
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
        questions={allQuestions}
      />
      </div>
      :
      <div className="question-container">
      {quiz}
      {
      checked === false ? 
      <button className="check-answers" onClick={checkAnswers}>Check answers</button> 
      :
      <h3 className="score"> You got {score()}/5 correct answers <button onClick={restartPage}>Play again</button> </h3>
      }
      </div>
    }
    </div>
  )
}

