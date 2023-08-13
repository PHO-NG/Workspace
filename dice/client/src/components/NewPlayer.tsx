'use client'
import { FC, useEffect, useState } from 'react'
import Icon from './PlayerIcons'
import { Socket } from 'socket.io-client'

interface NewPlayerProps {
  lobbyName: string
  lobbyId: string
  socket: Socket
//   newPlayerLoaded: boolean
  updatePlayer: (bool : boolean) => void
}

const NewPlayer: FC<NewPlayerProps> = ({lobbyName, lobbyId, socket, updatePlayer}) => {
    const [counter, setCounter] = useState(0)
    const [userData, setUserData] = useState<Player>({
        id: socket.id,
        name: "",
        icon: "",
    })

    useEffect(() => {
        setUserData(prev => ({...prev, icon: "/crew" + ((Math.abs(5 * counter) % 6 ) + 1) + ".png"}))
    }, [counter])

    const handleClick = () => {
        updatePlayer(true)
        socket.emit('join-lobby', userData, lobbyId)
    }

    return (
        <>
            <div className='flex flex-col z-30 w-3/12 h-3/5 border-red border-8 rounded-lg mx-auto fixed left-[37.5%] bottom-1/3 bg-black'>
                <h2 className='text-5xl font-bold mx-auto my-7'>{lobbyName}</h2>
                <label className='text-3xl whitespace-nowrap mx-auto' htmlFor="nickName">NAME:</label>
                <input className='text-3xl border-white mx-auto opacity-80 bg-black border-2 w-[60%] text-center focus:outline-none focus:opacity-100' 
                autoComplete="off" type="text" value={userData.name} onChange={(e) => setUserData(prev => ({...prev, name: e.target.value}))} />
                <h2 className='mx-auto text-3xl my-7'>ICON:</h2>
                <div className='flex mx-auto'>
                    <button className='text-red text-7xl mx-5 font-bold' onClick={() => setCounter(count => count - 1)}>{"<"}</button>
                    <Icon 
                        icon={"/crew" + ((Math.abs(5 * counter) % 6 ) + 1) + ".png"}
                        size={200}
                    />
                    <button className='text-red text-7xl mx-5 font-bold' onClick={() => setCounter(count => count + 1)}>{">"}</button>
                </div>
                <button className='text-3xl border-red border-8 rounded-lg w-64 m-auto py-3 font-bold' onClick={handleClick}>JOIN LOBBY</button>
        
            </div>
            <div className='w-screen h-screen opacity-50 z-10 border-2 absolute left-0 top-0 flex justify-center bg-black'></div>
        </>
    )
}
export default NewPlayer