import type { Metadata } from 'next'
import Base from "./base";
import RecoilContextProvider from "@/providers/RecoilContextProvider";

export const metadata: Metadata = {
  title: 'Comma',
  description: 'Compose market community',
}

export const revalidate = 0

export default function RootLayout({children}: {
  children: React.ReactNode
}) {
  return (
    <RecoilContextProvider>
      <Base>{children}</Base>
    </RecoilContextProvider>
  );

}
