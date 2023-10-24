/* eslint-disable react/no-unescaped-entities */
import { FC, useState } from 'react'
import Image from 'next/image'
import './styles.css'

const Info: FC = () => {
    const [modal, setModal] = useState<boolean>(false)

    const handleModal = () => {
        setModal(!modal)
    }

    return <>
        <button onClick={handleModal} className='absolute top-5 right-5 z-50'>
            <Image 
                src={'/info.png'}
                className={''}
                width={60}
                height={60}
                alt={'info'}
                priority={true}
                placeholder={"blur"}
                blurDataURL={'/info.png'}
            />
        </button>

        { modal === true &&
        <>
            <div className='flex flex-col z-40 w-4/12 h-3/6 overflow-auto border-red border-8 rounded-lg mx-auto fixed left-1/2 -translate-x-2/4 top-2/4 -translate-y-2/4 bg-black px-3 pb-3'>
                <h2 className='font-bold text-center text-6xl my-4'>Liar's Dice rules</h2>
                <ol className='ml-4 list-decimal'>
                    <li>The game can be played with 2-6 players</li>
                    <li>Each player has five 6-sided dice. At the start of each turn, every player rolls their dice.</li>
                    <li>The first player is determined by the host in the first game. After the first game, the player who lost the previous round goes first and can choose whether to proceed clockwise or anticlockwise.</li>
                    <li>The first player targets another player and calls a bid consisting of a die face (1-6) and an amount. This amount is a guess on how many of each face have been rolled by all the players at the table, including themselves. For example, a player might bid "five 2's," indicating they believe there are at least five 2's and 1's combined.</li>
                    <li>The die face 1 is considered universal and is added to the total quantity of any die face unless specified otherwise.</li>
                    <li>The targeted player must respond by either:</li>
                    <ul className='ml-8 list-disc'>
                        <li >Making a bid with the same quantity but a higher die face value.</li>
                        <li>Making a bid with the same die face value but a higher quantity.</li>
                        <li>Making a bid with both a higher die face value and a higher quantity.</li>
                        <li>Calling the bid as false.</li>
                    </ul>
                    <li>If a bid is called as false, all players reveal their dice, and the total quantity of the called die value is counted.</li>
                    <li>If the total counted amount is the same or higher than the bid amount, the caller loses. Otherwise, the player who made the bid loses.</li>
                    <li>Players are allowed to make their own punishments or penalties (e.g., taking a shot in a drinking game scenario).</li>
                    <li>When a round is over, a new game begins, and the starting player is the one who lost the previous round, except in the first game where the host starts.</li>
                </ol>
                
            </div>
            <div onClick={() => setModal(false)} className='w-screen h-screen opacity-50 z-10 absolute left-0 top-0 flex justify-center bg-black'></div>
        </> 
        }
    </>
}

export default Info