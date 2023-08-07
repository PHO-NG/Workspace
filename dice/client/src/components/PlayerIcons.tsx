/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Image from 'next/image'

type Props = {
  icon: string,
  size: number,
  styles?: string
}

export default function PlayerIcons({icon, size, styles}: Props) {

  return (
    <Image 
      src={icon}
      className={styles}
      width={size}
      height={size}
      alt={icon}
      priority={true}
      placeholder="blur"
      blurDataURL={'/crew1.png'}
    />
  )
}