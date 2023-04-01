import React, {ReactElement, useMemo, useState} from "react";
import {
    AppBar, Avatar,
    Box,
    Card, CardContent,
    CardHeader,
    CircularProgress,
    IconButton,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowBack, Send} from "@mui/icons-material";
import {useMutation, useQuery} from "react-query";
import {getChats, sendMessage} from "../api/chat";
import {getMatches, getMe} from "../api/profilo";
import placeholder from '../assets/placeholder.svg'

export default function ChatWindow(): ReactElement {
    const navigate = useNavigate();
    const chat = useQuery('chat', getChats)
    const me = useQuery('me', getMe, {refetchOnWindowFocus: false})
    const matches = useQuery('matches', getMatches)
    const {id} = useParams()
    const sendMessageMutation = useMutation('sendMessage', (message: string) => sendMessage(id!, message), {onSuccess: () => chat.refetch()});
    const [message, setMessage] = useState("");

    const [currentChat, currentPerson] = useMemo(() => {
        const selectedChat = chat.data?.find(x => x.id === id);
        const selectedPerson = matches.data?.find(x => x.tessera === selectedChat?.tessera1 || x.tessera === selectedChat?.tessera2);
        return [selectedChat, selectedPerson]
    }, [chat, matches, id])

    const onSendMessage = () => {
        sendMessageMutation.mutate(message)
        setMessage('')
    }

    if (!chat.isSuccess || !matches.isSuccess) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <CircularProgress/>
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <AppBar position={'static'}>
                <Toolbar>
                    <IconButton onClick={() => navigate("/chat")}>
                        <ArrowBack sx={{color: 'white'}}/>
                    </IconButton>
                    <Typography fontWeight={600}>{currentPerson?.nome}</Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{flex: 1, overflow: 'auto'}}>
                {currentChat?.messages.length === 0 && (
                    <Typography textAlign={'center'} sx={{pt: 2}}>
                        Ancora nessun messaggio? Supera la timidezza!
                    </Typography>
                )}
                {currentChat?.messages.map((message) => {
                    const isMine = message.sender !== currentPerson?.tessera
                    const time = message?.sentAt.split('T')[1].split('.')[0].split(":")
                    time[0] = (parseInt(time[0]) + 2).toString().padStart(2, '0')
                    return (
                        <Card sx={{mx: 2, my: 1, backgroundColor: isMine ? 'white' : 'primary.light', color: isMine ? 'inherit' : 'primary.contrastText'}}>
                            <CardHeader
                                title={message.sender === currentPerson?.tessera ? currentPerson?.nome : 'Tu'}
                                avatar={<Avatar sx={{height: 24, width: 24}} src={isMine ? (me.data?.avatarPath ?? placeholder) : (currentPerson?.avatarPath ?? placeholder)} />}
                                subheader={message?.sentAt.split('T')[0] + ' ' + time.join(":")}
                                subheaderTypographyProps={{color: isMine ? 'inherit' : 'primary.contrastText'}}
                            />
                            <CardContent sx={{py: 0}}>{message.message}</CardContent>
                        </Card>
                    )
                })}
            </Box>
            <Box display={'inline-flex'} flexDirection={'row'} p={1}>
                <TextField value={message} onChange={(e) => setMessage(e.target.value)} variant='outlined' placeholder={'Scrivi un messaggio'} fullWidth/>
                <IconButton disabled={!message} onClick={onSendMessage}><Send/></IconButton>
            </Box>
        </Box>
    )
}