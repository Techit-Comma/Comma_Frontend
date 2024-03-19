import React, {useEffect, useState} from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar, Avatar, ListItem
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Divider from "@material-ui/core/Divider";
import {GetCookie, getLoginState, Logout, ReissueTokens} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {
  baseUrl,
  loginState,
  memberIdState,
  nicknameState,
  profileImageUrlState,
  usernameState
} from "@/store/store";
import {router} from "next/client";

interface NotificationItem {
  notificationId: number;
  message: string;
  redirectUrl: string;
  publisherName: string;
  publisherImageUrl: string;
  isRead: boolean;
  createDate: any
}

function NotificationButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationList, setNotificationList] = useState<NotificationItem[]>();

  // 공통 변수
  const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [memberId, setMemberId] = useRecoilState(memberIdState);
  const [nickname, setNickname] = useRecoilState(nicknameState);
  const [profileImageUrl, setProfileImageUrl] = useRecoilState(profileImageUrlState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function getNotification(accessToken:string, retryCount= 0) { // retry도 공통 함수화 ㄱㄱ
    const response = await fetch(requestUrl + `/notification`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      }
    });

    if(response.status === 401){
      const accessToken = await ReissueTokens(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
      if(!accessToken || retryCount >= 3) {
        Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
        toast.error("재로그인이 필요합니다.")
        return;
      }
      await getNotification(accessToken, retryCount + 1);
    }

    const responseData = await response.json();
    setNotificationList(responseData);
  }

  async function readNotification(accessToken:string, notificationId:number, retryCount= 0) { // retry도 공통 함수화 ㄱㄱ
    const response = await fetch(requestUrl + `/notification`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({ notificationId })
    });

    if(response.status === 401){
      const accessToken = await ReissueTokens(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
      if(!accessToken || retryCount >= 3) {
        Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
        toast.error("재로그인이 필요합니다.")
        return;
      }
      await readNotification(accessToken, retryCount + 1);
    }
  }

  const handleReadNotification = async (notificationId:number) => {
    const accessToken = GetCookie("accessToken");
    await readNotification(accessToken, notificationId); // API 호출

    // 알림 목록에서 해당 알림의 isRead 상태를 true로 업데이트
    const updatedNotifications = notificationList?.map((notification) =>
        notification.notificationId === notificationId ? { ...notification, isRead: true } : notification
    );
    setNotificationList(updatedNotifications); // 업데이트된 알림 목록으로 상태 업데이트
  };

  useEffect(() => {
    if (isLogin) {
      getNotification(GetCookie('accessToken'));
    }
  }, [isLogin]); // 의존성 배열에 isLogin 추가
  return (
      <div>
        <IconButton onClick={handleClick}>
          <FontAwesomeIcon icon={faBell} color="white"/>
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              style: {
                backgroundColor: '#262626', // 다크 모드에 적합한 어두운 배경색
                color: 'white', // 밝은 텍스트 색상
                marginLeft: '2rem',
                maxHeight: '16rem',
              },
            }}
        >
          {notificationList?.map((item, index) => [
            <ListItem key={item.notificationId} button alignItems="flex-start" onClick={() => handleReadNotification(item.notificationId)}>
              <ListItemAvatar>
                <Avatar alt={item.publisherName} src={item.publisherImageUrl} />
              </ListItemAvatar>
              <ListItemText
                  primary={item.message}
                  secondary={`${item.publisherName} | ${new Date(item.createDate).toLocaleDateString()} `}
                  secondaryTypographyProps={{ style: { color: 'white' } }}
              />
              {!item.isRead && <Badge color="primary" variant="dot" />}
            </ListItem>,
            index < notificationList.length - 1 ? <Divider key={`divider-${index}`} /> : null
          ])}
        </Menu>
      </div>
  );
}

export default NotificationButton;