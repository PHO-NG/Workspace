/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Icon from './PlayerIcons'
import { Loader2 } from 'lucide-react'


type Props = {
    name: string,
    icon: string,
    ready: boolean,
    filled: boolean,
    loaded: boolean
    key: number
}


export default function LobbyCard({name, icon, ready, filled, loaded, key}: Props) {
  return (
    <div className='flex h-14 my-2'>
        <div className='-mt-1 relative '>
            {filled == true && 
                (loaded == true ?
                <Icon 
                    icon={icon}
                    size={70}
                />
                :
                <Loader2 size={69} className='animate-spin -ml-1' />)
            }
        </div>

        {filled ?
        <div className='flex w-full'>
            <div className={`w-3 h-full mx-3 ${ready ? 'bg-green' : 'bg-lightgray'}`}></div>   
            {key == 1 &&
            <Icon 
                icon="/host.png"
                size={20}
                styles='fixed ml-9 -mt-4' //change fixed
            />
            }
            <div className={`w-full h-full ${ready ? "bg-[#2323237e]" : "bg-gray"}`}>
                <h2 className='text-5xl my-1 ml-3'>{name}</h2>
            </div>
        </div>
         : 
        <div className='flex w-full ml-16 opacity-20'>
            <div className="w-3 h-full mx-3 bg-gray"></div>
            <div className="w-full h-full bg-darkgray">
                <h2 className='text-5xl my-1 ml-3'>OPEN</h2>
            </div>
        </div>
         }
    </div>
  
  )
}