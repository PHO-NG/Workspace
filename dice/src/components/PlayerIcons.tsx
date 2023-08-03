/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Image from 'next/image'

type Props = {
  icon: string,
  size: number,
}

export default function PlayerIcons({icon, size}: Props) {

  return (
    <Image 
      src={icon}
      className=''
      width={size}
      height={size}
      alt={icon}
      priority={true}
    />
  )
}