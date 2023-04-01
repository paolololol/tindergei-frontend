import {useQuery} from "react-query";
import {getChats} from "../api/chat";
import {getMatches, getMe, ProfiloViewModel} from "../api/profilo";
import {
    Avatar,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import React from "react";
import placeholder from '../assets/placeholder.svg'
import {useNavigate} from "react-router-dom";

function findMatch(matches: ProfiloViewModel[], tessera: string) {
    return matches.find(x => x.tessera === tessera);
}

export default function Chat() {
    const chat = useQuery('chat', getChats)
    const matches = useQuery('matches', getMatches)
    const me = useQuery('me', getMe, {enabled: false})
    const navigate = useNavigate()

    if (chat.isLoading || matches.isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <CircularProgress/>
            </Box>
        )
    }

    if (chat.isSuccess && matches.isSuccess && !chat.data.length) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Box mx={2} bgcolor={'primary.light'} borderRadius={4}
                     sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2}}>
                    <Typography textAlign={'center'} color={'primary.contrastText'}>
                        Non hai ancora avuto nessun match!<br/>Non perdere la speranza
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', overflow: 'auto', height: '100%'}}>
            <List sx={{width: '100%'}}>
                {chat.data!.map((chat) => {
                    const person = findMatch(matches.data!, me.data?.tessera === chat.tessera1 ? chat.tessera2 : chat.tessera1);
                    const time = chat?.lastMessage ? chat?.lastMessage.split('T')[1].split('.')[0].split(":") : ['0']
                    time[0] = (parseInt(time[0]) + 2).toString().padStart(2, '0')
                    return (
                        <ListItem key={chat.id} disablePadding>
                            <ListItemButton onClick={() => navigate(`/chat/${chat.id}`)}>
                                <ListItemAvatar><Avatar src={person?.avatarPath ?? placeholder}/></ListItemAvatar>
                                <ListItemText secondary={chat?.lastMessage ? chat?.lastMessage?.split('T')[0] + ' ' + time.join(":") : undefined}>{person?.nome}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
}