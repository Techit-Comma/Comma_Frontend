import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import {getUserInfo} from "@/libs/auth";
import {useRecoilState} from "recoil";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {UserInfos} from "@/types";

type UserContextType = {
    userInfo: UserInfos;
    isLoading: boolean;
    isLogin: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props{
    [propName:string]:any;
}

export const MyUserContextProvider = (props:Props) => {
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);

    const getUserDetails = () => getUserInfo();

    useEffect(()=>{
        if(!isLoadingData && !userInfos){
            setIsLoadingData(true)
            Promise.allSettled([getUserDetails()]).then((results)=>{
                const userDetailsPromise = results[0]

                if(userDetailsPromise.status==='fulfilled'){
                    setUserInfos(userDetailsPromise.value as UserInfos)
                    setIsLogin(true);
                }
                setIsLoadingData(false)
            })
        }else if(!isLoadingData){
            setUserInfos({
                username: "",
                memberId: "0",
                nickname: "",
                profileImageUrl: "",
            });
        }
    },[])

    const value = {
        userInfo: userInfos,
        isLoading: isLoadingData,
        isLogin: isLogin,
    }

    return <UserContext.Provider value={value} {...props}/>
}

const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error(`useUser must be used within a MyUserContextProvider.`);
    }
    return context;
};

// 수정 시도 했으나, 정상 동작하지 않았음에 다른 방법으로 대체