/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Image from "next/image"

export default function Title() {
  return (
    <section className='mt-[-50px] mb-24 select-none'>
        <Image 
            src="/dice.png"
            className='m-auto mb-[-410px] z-0 relative opacity-80'
            width={500}
            height={500}
            alt="me"
            priority={true}
        />
        
        <h1 className="p-20 w-90 text-9xl relative text-center tracking-[5%] whitespace-nowrap">Liar’s Dice</h1>
        
    </section>
  )
}