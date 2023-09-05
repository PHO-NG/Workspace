import { FC, useEffect, useState } from 'react'
import './styles.css'

interface TimerButtonProps {
  duration: number
  turn: boolean
}

const TimerButton: FC<TimerButtonProps> = ({duration, turn}) => {
  const [pause, setPause] = useState<boolean>(false)

  const rectangleStyle = {
    "backgroundColor": turn ? "#54000E" : "#3F3F3F",
    animationPlayState: pause ? "paused" : "running"
  }

  const rightStyle = {
    "animation": `right1 ${duration/4}s ease-in forwards`
  }

  const bottomStyle = {
    "animation": `bottom1 ${duration/4}s ${duration/4}s ease-in forwards`
  }

  const leftStyle = {
    "animation": `left1 ${duration/4}s ${(duration * 2)/4}s ease-in forwards`
  }

  const topStyle = {
    "animation": `top1 ${duration/4}s ${(duration * 3)/4}s ease-in forwards`
  }

  const handleClick = () => {
    setPause(prev => !prev)
  }

  return <>
    <div className="relative rectangle caret-transparent" onClick={(handleClick)}>
      <div className="right" style={{...rectangleStyle, ...rightStyle, }}></div>
      <div className="bottom" style={{...rectangleStyle, ...bottomStyle}}></div> 
      <div className="left" style={{...rectangleStyle, ...leftStyle}}></div>
      <div className="top" style={{...rectangleStyle, ...topStyle}}></div>
    </div>
  </>
}

export default TimerButton