'use client'

import { MyUserContextProvider } from "@/hooks/useUser"

interface Props{
    children:React.ReactNode
}

const UserProvider: React.FC<Props> = ({children}) => {
    return(
        <MyUserContextProvider>
            {children}
        </MyUserContextProvider>
    )
}

export default UserProvider