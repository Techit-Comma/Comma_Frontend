import React, {forwardRef, useState} from 'react'
import { twMerge } from 'tailwind-merge'
import {Badge, ListItem, ListItemIcon, ListItemText, Menu} from "@mui/material";
import { useRouter } from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faUser} from "@fortawesome/free-solid-svg-icons";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    profileImageUrl?: string;
}

const ProfileButton = forwardRef<HTMLButtonElement, Props>(({
    className,
    children,
    disabled,
    type = 'button',
    profileImageUrl,
    ...props
},ref)=>{
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return(
        <div>
          <button
              type={type}
              className={twMerge(`w-full rounded-full bg-blue-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,className)}
              disabled={disabled}
              ref={ref}
              onClick={handleClick}
              {...props}
              style={{
                backgroundImage: `url(${profileImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
          >
            {children}
          </button>
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
                  marginTop: '0.5rem',
                },
              }}
          >
            <ListItem button className="w-full m-2" alignItems="center">
              <div>
                <FontAwesomeIcon icon={faUser} className="mr-2.5"/> 프로필
              </div>
            </ListItem>
            <ListItem button className="w-full m-2" alignItems="center" onClick={()=>router.push('/account')}>
              <div>
                <FontAwesomeIcon icon={faGear} className="mr-2.5" /> 계정 설정
              </div>
            </ListItem>
          </Menu>
        </div>
    )
})

ProfileButton.displayName = 'ProfileButton'

export default ProfileButton