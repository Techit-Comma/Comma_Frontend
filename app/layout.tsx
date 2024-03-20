'use client';

import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import { Player } from '@/components/Player'
import {RecoilRoot} from "recoil";


const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Comma',
  description: 'Compose market community',
}

export const revalidate = 0



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = []

  return (
    <html lang="en">
      <body className={font.className}>
      <RecoilRoot>
        <ToasterProvider/>
        <ModalProvider/>
        <Sidebar songs={userSongs}>
          {children}
        </Sidebar>
        <Player/>
      </RecoilRoot>
      </body>
    </html>
  )
}
