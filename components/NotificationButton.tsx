import React, {useEffect, useState} from 'react';
import {
  IconButton,
  Badge,
  Menu,
  ListItemText,
  ListItemAvatar, Avatar, ListItem
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Divider from "@material-ui/core/Divider";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {loginState} from "@/store/store";
import axiosClient from "@/libs/axiosClient";
import {CheckAccessToken} from "@/libs/auth";

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
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [isLoading, setIsLoading] = useState(true);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function getNotification() {
    try {
      const response = await axiosClient.get('/notification');
      const responseData = response.data;
      setNotificationList(responseData);
    } catch (error) {
      toast.error('알림 정보를 가져올 수 없습니다.', error);
      return undefined;
    }
  }

  async function getNotificationToLongPolling() {
    try {
      const response = await axiosClient.get('/notification/subscribe');
      const responseData = response.data;
      setNotificationList(responseData);
    } catch (error) {
      toast.error('알림 정보를 가져올 수 없습니다.', error);
      return undefined;
    }
  }

  async function readNotification(notificationId:number) {
    try {
      await axiosClient.post('/notification', {
        "notificationId": notificationId,
      });
    } catch (error) {
      toast.error('알림을 읽을 수 없습니다.', error);
      return undefined;
    }
  }

  const handleReadNotification = async (notificationId:number) => {
    await readNotification(notificationId);

    // 알림 목록에서 해당 알림의 isRead 상태를 true로 업데이트
    const updatedNotifications = notificationList?.map((notification) =>
        notification.notificationId === notificationId ? { ...notification, isRead: true } : notification
    );

    setNotificationList(updatedNotifications); // 업데이트된 알림 목록으로 상태 업데이트
  };

  useEffect(() => {
    // 로그인 상태 확인 로직
    CheckAccessToken().then((loggedIn) => {
      setIsLogin(loggedIn);
      setIsLoading(false); // 로그인 상태 확인이 완료됨
    });
  }, []);

  useEffect(() => {
    if (!isLoading && isLogin) {
      getNotification();
    }
  }, [isLogin, isLoading]);

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
          {notificationList?.length !== 0 ? (
              notificationList?.map((item, index) => [
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
                index < notificationList?.length - 1 ? <Divider key={`divider-${index}`} /> : null
              ])
          ) : (
              <ListItem button alignItems="flex-start">
                <ListItemText primary="알림이 없습니다."/>
              </ListItem>
          )}
        </Menu>
      </div>
  );
}

export default NotificationButton;