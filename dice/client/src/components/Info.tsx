/* eslint-disable react/no-unescaped-entities */
import { FC, useState } from 'react'
import Image from 'next/image'

const Info: FC = () => {
    const [modal, setModal] = useState<boolean>(false)

    const handleModal = () => {
        setModal(!modal)
    }

    return <>
        <button onClick={handleModal}>
            <Image 
                src={'/info.png'}
                className={''}
                width={30}
                height={30}
                alt={'info'}
                priority={true}
                placeholder={"blur"}
                blurDataURL={'/info.png'}
            />
        </button>

        { modal === true &&
        <>
            <div className='flex flex-col z-10 w-3/12 h-4/6 border-red border-8 rounded-lg mx-auto fixed left-1/2 -translate-x-2/4 bottom-1/4 bg-black'>
            <h2>Liar's Dice rules</h2>
            <p>Each player has five 6-sided dice. At the start of each turn, every player rolls their dice.</p>
            <p>First player will call a bid consisting of a die face (1-6) and an amount. This amount is a guess on how many of each face have been rolled by all the players at the table, including themselves. For example, a player might bid "five 2's."</p>
            <p>Note: The die face, 1, is considered a universal die face and is added to the total quantity of any die face, UNLESS SPECIFIED THAT IT ISN'T</p>
            
            </div>
            <div onClick={() => setModal(false)} className='w-screen h-screen opacity-50 z-0 absolute left-0 top-0 flex justify-center bg-black'></div>
        </> 
        }
    </>
}

export default Info