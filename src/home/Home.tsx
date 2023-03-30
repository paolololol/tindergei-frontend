import React, {ReactElement, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {getAvailable, getMatches} from "../api/profilo";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    IconButton, Snackbar,
    Typography
} from "@mui/material";
import placeholder from '../assets/placeholder.svg'
import {Favorite, NotInterested} from "@mui/icons-material";
import {likePerson} from "../api/chat";

export default function Home(): ReactElement {
    const me = useQuery('me', getMatches, {refetchOnWindowFocus: false});
    const available = useQuery('available', getAvailable, {enabled: !!me.data, refetchOnWindowFocus: false});
    const matches = useQuery('matches', getMatches, {enabled: !!me.data, refetchOnWindowFocus: false});
    const [current, setCurrent] = useState(0);
    const like = useMutation(likePerson);
    const [likedBy, setLikedBy] = useState<string | null>(null);

    const onLike = (tessera: string, nome: string) => {
        like.mutateAsync(tessera).then((data) => {
            if(data) {
               matches.refetch();
               setLikedBy(nome);
            }
        });
        setCurrent(x => x + 1);
    }

    if (!available.data) {
        return (
            <Box height='100%' display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <CircularProgress/>
            </Box>
        )
    }

    if (available.isSuccess && (!available.data.length || available.data.length === current)) {
        return (
            <Box height='100%' display={'flex'} justifyContent={'center'} alignItems={'center'}
                 flexDirection={'column'}>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={!!likedBy}
                    autoHideDuration={6000}
                    onClose={() => setLikedBy(null)}
                >
                    <Alert severity="success">Piaci anche tu a {likedBy}!</Alert>
                </Snackbar>
                <Box bgcolor={'primary.light'} mx={2} p={2} borderRadius={2} justifyContent={'center'} display={'flex'}
                     flexDirection={'column'}>
                    <Typography textAlign={'center'} color={'primary.contrastText'}>
                        Sembra che non ci sia più nessun* disponibile.<br/>Riprova più tardi e non desistere!
                    </Typography>
                    <Button variant='contained' color={'warning'} component={'a'}
                            href={'whatsapp://send?text=Come mai non sei ancora su tinder.cngei.it???'}>Condividi</Button>
                </Box>
            </Box>
        )
    }

    const currentItem = available.data[current];
    return (
        <Box bgcolor={'primary.light'} height='100%' display={'flex'} justifyContent={'center'} alignItems={'center'}
             flexDirection={'column'}>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={!!likedBy}
                autoHideDuration={6000}
                onClose={() => setLikedBy(null)}
            >
                <Alert severity="success">Piaci anche tu a {likedBy}!</Alert>
            </Snackbar>
            <Card sx={{mx: 2, maxHeight: '90%', maxWidth: '90%', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                <CardHeader title={currentItem.nome} subheader={currentItem.sezione}/>
                <CardContent sx={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                    <img src={currentItem.avatarPath ?? placeholder} alt={currentItem.nome} style={{flex: 1}}/>
                    <Typography sx={{flex: 1}}>{currentItem.descrizione}</Typography>
                </CardContent>
                <CardActions sx={{display: 'flex', justifyContent: 'space-between', px: 4}}>
                    <IconButton size={'large'} onClick={() => setCurrent(x => x + 1)}><NotInterested
                        fontSize={'large'}/></IconButton>
                    <IconButton size={'large'} onClick={() => onLike(currentItem.tessera, currentItem.nome)}><Favorite color={'error'}
                                                                                                     fontSize={'large'}/></IconButton>
                </CardActions>
            </Card>
        </Box>
    )
}