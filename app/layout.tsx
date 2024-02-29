'use client';

import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import UserProvider from '@/providers/UserProvider'
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

export default async function RootLayout({
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
        <UserProvider>
          <ModalProvider/>
          <Sidebar songs={userSongs}>
            {children}
          </Sidebar>
          <Player/>
        </UserProvider>
      </RecoilRoot>
      </body>
    </html>
  )
}
