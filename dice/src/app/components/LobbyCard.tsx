/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Icon from './PlayerIcons'


type Props = {
    params: {
        name: string,
        icon: string,
        readyStatus: boolean,
        host: boolean,
        filled: boolean,
    }
}

export default function LobbyCard({params: {name, icon, readyStatus, host, filled}}: Props) {

  return (
    <div className='h-16'>
        <div>
            {filled == true && 
            // <Icon info = {icon}/>
            "TEMP"
            }
        </div>
        {filled ?
         <div>
            <div className={'w-3 h-full mx-5' + readyStatus ? 'bg-green' : 'bg-lightgray'}></div>
            <div className={'w-full h-full' + readyStatus ? 'bg-darkgray' : 'bg-lightgray'}>
                {name}
            </div>
         </div>
         : 
        <div>
            <div className={'w-3 h-full mx-5'}></div>
            <div className={'w-full h-full'}>
                <h2>OPEN</h2>
            </div>
        </div>
         }
    </div>
  
  )
}