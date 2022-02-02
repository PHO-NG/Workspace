import React from "react"
import {nanoid} from "nanoid"
import StartUp from "./Components/StartUp"
import Questions from "./Components/Questions"


export default function App() {
  const [start, setStart] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  

  const [allQuestions, setAllQuestions] = React.useState([])
  const [selected, setSelected] = React.useState([])
    
    
// try make state object array > map allquestions into new array, getting id and having state selected, put it in prop

  React.useEffect(() => {
      fetch("https://opentdb.com/api.php?amount=10")
          .then(res => res.json())
          .then(data => setAllQuestions(data.results))

  }, [])


  function checkAnswers() {
    setChecked(true)
  }



  function initialiseStated() {
    for (let i = 1; i <= 10; i++) {
      let temp = {
        id: i,
        select: ""
      }
      setSelected(prev => [temp, ...prev])
    }
    
  }


  function updateSelected(id, text) {
    setSelected(prev => prev.map(data => (
      data.id === id ? { ...data, select:text } : data)
    ))
  }

  function startQuiz() {
    setStart(prev => !prev)
    initialiseStated()
    console.log(selected.length)
    
  }

  let id = 0
  const quiz = allQuestions.map(question => (
      <Questions 
        {...question}
        key={nanoid()}
        id={++id}
        checked={checked}
        selected={selected}
        updateSelected={updateSelected}
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

