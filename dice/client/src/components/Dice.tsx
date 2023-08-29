import { FC } from 'react'
import Die from '@/components/Die'

interface DiceProps {
  dice: number[]
  reveal: boolean
  size: number
}

const Dice: FC<DiceProps> = ({dice, reveal, size}) => {
  
  const diceSet = dice.map((die, index) => {
    const angle = (360 / dice.length) *  Math.PI/180 * index
    const xPos = 2*size + (Math.sin(angle)) * size * 1.3
    const yPos = size + Math.cos(angle) * size * 1.3
    const styles = {
      position: "absolute",
      left: xPos,  
      top: yPos
    }
    return (
      <Die 
        face = {die}
        size = {size}
        rotation = {index} 
        reveal = {reveal}
        customStyle = {styles}
        key = {index}
      />
    ) 
  })

  const styles = {
    width: size * 5,
    height: size * 5
  }

  return <>
    <div className='relative' style={styles}>
      {diceSet}
    </div>
  </>
}

export default Dice