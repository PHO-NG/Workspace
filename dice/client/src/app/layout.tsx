import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})


export const metadata: Metadata = {
  title: "Liar's Dice",
  description: 'Created by PHO-NG',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body className='bg-black text-white'>{children}</body>
    </html>
  )
}
