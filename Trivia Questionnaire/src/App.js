import React from "react"
import {nanoid} from "nanoid"
import StartUp from "./Components/StartUp"
import Questions from "./Components/Questions"


export default function App() {
  const [start, setStart] = React.useState(false)

  const [allQuestions, setAllQuestions] = React.useState([])
    
    
  React.useEffect(() => {
      fetch("https://opentdb.com/api.php?amount=10")
          .then(res => res.json())
          .then(data => setAllQuestions(data.results))
  }, [])


  function checkAnswers() {

  }

  function startQuiz() {
    setStart(prev => !prev)
  }

  const quiz = allQuestions.map(question => (
      <Questions 
        key={nanoid()}
        {...question}
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
      <button onClick={checkAnswers}>Check answers</button>
      </div>
    }
    </div>
  )
}

