import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    AppBar,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box, Button,
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
        try {
            if (Notification && Notification.permission !== 'granted') {
                setNotificationRequested(false);
            }
        } catch(e) {
            console.log(e);
        }
    }, [])
    const onNotificationClicked = useCallback(() => {
        if(me.isSuccess && me.data) {
            try {
                if (Notification.permission !== 'granted') {
                    setNotificationRequested(true)
                    Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                            getFbToken()?.then((token) => {
                                console.log(token);
                                sendToken.mutate(token);
                            })
                        }
                    });
                }
            } catch(e) {
                console.log(e);
            }
        }
    }, [me])

    const hasCompletedSurvey = localStorage.getItem("completed") === "true";
    const isOver = new Date() > new Date('2023-04-01T21:59:59.999Z');

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <AppBar position={'static'}>
                <Toolbar sx={{display: 'inline-flex', justifyContent: 'space-between'}}>
                    <Avatar src={logo} sx={{mr: 1}}></Avatar>
                    <Typography fontWeight={600}>TinderGEI</Typography>
                    {!notificationRequested && <IconButton color={'inherit'} onClick={onNotificationClicked}><NotificationAdd /></IconButton>}
                </Toolbar>
            </AppBar>
            <Box sx={{flex: 1, overflow: 'auto'}}>
                {(!hasCompletedSurvey && isOver) ? <GameOver /> : <Outlet/>}
            </Box>
            {(hasCompletedSurvey || !isOver) && <BottomNavigation
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
            </BottomNavigation>}
        </Box>
    )
}

function GameOver(): ReactElement {
   return (
      <Box sx={{flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', px: 2}} bgcolor={'primary.light'}>
            <Typography variant={'subtitle1'} color={'primary.contrastText'}>Grazie per aver partecipato!</Typography>
            <Typography color='primary.contrastText' variant={'body2'}>
                Speriamo che vi siate divertiti e abbiate colto lo spirito giocoso dell'iniziativa.<br/><br/>
                I Servizi Informatici del CNGEI stanno lavorando per fornire strumenti innovativi all'associazione, vi
                abbiamo proposto questo esperimento per far conoscere questo settore e per stimolare una riflessione su
                come le modalità di comunicazione e interazione si stanno evolvendo.<br/><br/>
                Una delle sfide per la nostra associazione è quella di essere al passo coi tempi e capire come i giovani
                interagiscono, per questo abbiamo pensato di proporvi un sondaggio per capire come possiamo governare e
                indirizzare in senso positivo i modi di incontrarsi e di comunicare che ormai sono perlopiù digitali.<br/>
            </Typography>
            <Box gap={2} mt={1}>
                <Button onClick={() => {localStorage.setItem("completed", "true"); window.open('https://forms.gle/SVtppgUG2RrXqXGy6', '_blank'); window.location.reload();}} color={'warning'} variant={'contained'}>Compila il sondaggio</Button>
                <Button onClick={() => {localStorage.setItem("completed", "true"); window.location.reload()}} sx={{color: '#ddd'}}>No grazie :(</Button>
            </Box>
      </Box>
   )
}