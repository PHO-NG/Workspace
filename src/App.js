import React from "react"
import {nanoid} from "nanoid"
import Title from "./Components/Title"
import Die from "./Components/Die"
import Info from "./Components/Info"


export default function App() {
  const [dice, setDice] = React.useState(diceRoll())

  const [tenzies, setTenzies] = React.useState(false)

  const [rolls, setRolls] = React.useState(0);

  /*---CHECK IF WINNING CONDITIONS ARE MET---*/
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
    }
  }, [dice])

  /*---INITIAL DICEROLL---*/
  function diceRoll() {
    const diceArr = []
    for (let i = 0; i < 10; i++) {
      diceArr.push({
        value: Math.floor(Math.random() * 6 ) + 1,
        isHeld: false,
        id: nanoid()
      })
    }
    return diceArr
  }

  /*---ROLLS ONLY THOSE THAT ARENT HELD---*/
  function roll() {
    let tempAr = dice.map(die => die.isHeld ? die : {...die, value: Math.floor(Math.random() * 6 ) + 1})
    setRolls(rolls + 1)
    /*---UNLESS RESTARTED GAME----*/
    if (tenzies) {
      tempAr = diceRoll()
      setRolls(0)
    }
    setDice(tempAr)
    setTenzies(false)
  }

  /*---HOLD A SPECIFIC DIE---*/
  function toggleHold(dieId) {
    const tempAr = dice.map(die => die.id === dieId ? {...die, isHeld: !die.isHeld} : die)
    setDice(tempAr)
  }

  const diceBoard = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld = {die.isHeld}
      toggleHold = {() => toggleHold(die.id)}
    />
  ))



  return (
    <main>
      <Title />
      <div className="game-container">
        {diceBoard}
      </div>
      <button onClick={roll}>{tenzies ? "Play Again" : "Roll"} {rolls}</button>
    </main>
  )
}
