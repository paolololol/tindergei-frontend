import React, {useEffect} from "react";
import {AppBar, Avatar, BottomNavigation, BottomNavigationAction, Box, Toolbar, Typography} from "@mui/material";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Chat, Home, Person} from "@mui/icons-material";
import {useQuery} from "react-query";
import {getMe} from "./api/profilo";
import logo from './assets/logo.png'
import {getChats} from "./api/chat";

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

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <AppBar position={'static'}>
                <Toolbar>
                    <Avatar src={logo} sx={{mr: 1}}></Avatar>
                    <Typography fontWeight={600}>TinderGEI</Typography>
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