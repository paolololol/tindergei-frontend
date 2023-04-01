import React, {useCallback, useEffect, useState} from "react";
import {
    AppBar,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Chat, Home, NotificationAdd, Person} from "@mui/icons-material";
import {useMutation, useQuery} from "react-query";
import {getMe, setNotificationToken} from "./api/profilo";
import logo from './assets/logo.png'
import {getChats} from "./api/chat";
import {getFbToken} from "./firebase";

export default function Layout() {
    const navigate = useNavigate()
    const location = useLocation()
    const me = useQuery('me', getMe);
    const chats = useQuery('chat', getChats, {enabled: !!me.data, refetchOnWindowFocus: true});
    useEffect(() => {
        if (me.isSuccess && !me.data) {
            navigate("/signup");
        }
    }, [me, navigate])
     const sendToken = useMutation('token', setNotificationToken);
    const [notificationRequested, setNotificationRequested] = useState(true);
    useEffect(() => {
        if(Notification.permission !== 'granted') {
            setNotificationRequested(false);
        }
    }, [])
    const onNotificationClicked = useCallback(() => {
        if(me.isSuccess && me.data) {
            if(Notification.permission !== 'granted') {
                setNotificationRequested(true)
                Notification.requestPermission().then((permission) => {
                    if(permission === 'granted') {
                        getFbToken()?.then((token) => {
                            console.log(token);
                            sendToken.mutate(token);
                        })
                    }
                });
            }
        }
    }, [me])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <AppBar position={'static'}>
                <Toolbar sx={{display: 'inline-flex', justifyContent: 'space-between'}}>
                    <Avatar src={logo} sx={{mr: 1}}></Avatar>
                    <Typography fontWeight={600}>TinderGEI</Typography>
                    {!notificationRequested && <IconButton color={'inherit'} onClick={onNotificationClicked}><NotificationAdd /></IconButton>}
                </Toolbar>
            </AppBar>
            <Box sx={{flex: 1, overflow: 'auto'}}><Outlet/></Box>
            <BottomNavigation
                showLabels
                value={location.pathname}
                onChange={(event, newValue) => {
                    navigate(newValue)
                }}
            >
                <BottomNavigationAction value={"/"} label="Home" icon={<Home/>}/>
                <BottomNavigationAction value="/chat" label={`Chat${chats.data?.length ? ` (${chats.data.length})` : ''}`}
                                        icon={<Chat/>}/>
                <BottomNavigationAction value="/profilo" label="Profilo" icon={<Person/>}/>
            </BottomNavigation>
        </Box>
    )
}