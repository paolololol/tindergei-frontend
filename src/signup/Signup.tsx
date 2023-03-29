import {
    Alert, Avatar,
    Box,
    Button,
    FormControl,
    FormControlLabel, List, ListItem,
    Radio,
    RadioGroup as MuiRadioGroup,
    Snackbar, Step, StepLabel, Stepper, Switch,
    Typography
} from "@mui/material";
import {Field, Formik, useField} from "formik";
import React, {useEffect, useState} from "react";
import wosm from '../assets/wosm.png'
import wagggs from '../assets/wagggs.png'
import fis from '../assets/fis.png'
import useLoggedInUser from "../utils/useLoggedInUser";
import {TextField, RadioGroup} from "formik-mui";
import {useMutation, useQuery} from "react-query";
import {getMe, ProfiloCreateModel, signup} from "../api/profilo";
import {useNavigate} from "react-router-dom";

export default function Signup() {
    const user = useLoggedInUser()
    const me = useQuery("me", getMe, {refetchOnReconnect: false, refetchOnWindowFocus: false})
    const [step, setStep] = useState(-1)
    const navigate = useNavigate()
    const {mutate} = useMutation((values: ProfiloCreateModel) => signup(values), {onSuccess: () => {
        me.refetch();
        navigate("/")
    }})
    useEffect(() => {
        if (me.isSuccess && me.data) {
            navigate("/")
        }
    }, [me, navigate])
    return (
        <Formik initialValues={{nome: user?.name, sexPreference: '', sex: '', descrizione: ''} as ProfiloCreateModel}
                onSubmit={(values) => mutate(values)}>
            {({submitForm}) => (
                <Box p={2} gap={2} display={'flex'} flexDirection={'column'} overflow={'auto'} height={'100%'}>
                    <Box bgcolor={'primary.main'} borderRadius={4} px={2} py={1}>
                        <Typography color={'white'} variant={'h5'}>Benvenuto o benvenuta!</Typography>
                        <Typography color={'white'} variant={'subtitle2'} sx={{fontStyle: 'italic'}}>
                            "Nuovi ceppi in cerca di nuove fiamme"
                        </Typography>
                    </Box>
                    <Box overflow={'auto'}>
                        {step === -1 && <LeBasi goNext={() => setStep(0)}/>}
                        {step === 0 && <ChiSei goNext={() => setStep(1)}/>}
                        {step === 1 && <Preferenze goNext={() => setStep(2)}/>}
                        {step === 2 && <Presentati goBack={() => setStep(1)} goNext={submitForm}/>}
                    </Box>
                </Box>
            )}
        </Formik>
    )
}

interface StepProps {
    goNext: () => void;
    goBack?: () => void;
}

function LeBasi({goNext}: StepProps) {
    const [ok, setOk] = useState<boolean>(false);
    return (
        <Box border={'2px dashed #257048'} borderRadius={4} px={2} overflow={'auto'}>
            <Typography variant={'subtitle1'}>Prima di tutto, leggi bene:</Typography>
            <Stepper activeStep={ok ? 6 : -1} orientation={'vertical'}>
                <Step><StepLabel>Questo sito viene lanciato il 1 aprile, non per caso</StepLabel></Step>
                <Step><StepLabel>Comportati decentemente, scherzare è divertente, esagerare no</StepLabel></Step>
                <Step><StepLabel>Non usiamo i dati del CNGEI, quello che scrivi qui è responsabilità tua</StepLabel></Step>
                <Step><StepLabel>Puoi usare uno pseudonimo, ma ogni violazione della legge scout o non sarà riportata a chi di dovere</StepLabel></Step>
                <Step><StepLabel>No, non è il modo per avere nuovi <span style={{textDecoration: 'line-through'}}>soci</span> tesserati tra 8 anni e 9 mesi</StepLabel></Step>
            </Stepper>
            <Box display={'inline-flex'} flexDirection={'row'} alignItems={'center'}>
                <Switch value={ok} onChange={(event, checked) => setOk(checked)}/>
                <Typography>Ho capito e mi va bene</Typography>
            </Box>
            <Button variant='contained' color={'primary'} disabled={!ok}
                    fullWidth
                    sx={{mb: 1}}
                    onClick={goNext}>Avanti</Button>
        </Box>
    )
}

function ChiSei({goNext}: StepProps) {
    const [value, setValue] = useState<string | null>();
    const [gido, setGido] = useState(false)
    return (
        <Box border={'2px dashed #257048'} borderRadius={4} px={2} py={1}>
            <Typography variant={'subtitle1'}>Cosa cerchi qui?</Typography>
            <FormControl>
                <MuiRadioGroup onChange={(event, newValue) => setValue(newValue)}>
                    <FormControlLabel value="l" control={<Radio/>} label="Lupetti/e"/>
                    <FormControlLabel value="e" control={<Radio/>} label="Esploratori/esploratrici"/>
                    <FormControlLabel value="r" control={<Radio/>} label="Rover"/>
                    <FormControlLabel value="adulti" control={<Radio/>} label="Soci adulti"/>
                    <FormControlLabel value="rcdf" control={<Radio/>} label="L'RCdF che deve correggermi il PP"/>
                </MuiRadioGroup>
            </FormControl>
            {value === 'rcdf' && <Typography sx={{pt: 2}}>Buona fortuna!</Typography>}
            <Box pt={2} display={'flex'} alignItems={'end'} justifyContent={'end'} gap={1}>
                {['l', 'e', 'r'].includes(value || '') &&
                    <Button variant='contained' color={'error'} onClick={() => setGido(true)}>Deferisciti</Button>}
                <Button variant='contained' color={'primary'} disabled={value !== 'adulti'}
                        onClick={goNext}>Avanti</Button>
            </Box>
            <Snackbar
                open={gido}
                autoHideDuration={6000}
                onClose={() => setGido(false)}
                message="Note archived"
            >
                <Alert severity="success" sx={{width: '100%'}}>
                    Grazie, il GIDO sarà notificato!
                </Alert>
            </Snackbar>
        </Box>
    )
}

function Preferenze({goNext}: StepProps) {
    const [sexInput] = useField('sex');
    return (
        <Box border={'2px dashed #257048'} borderRadius={4} px={2} py={1}>
            <Typography variant={'subtitle1'}>Parliamo di te: che distintivo porti sulla camicia?</Typography>
            <FormControl>
                <Field component={RadioGroup} name={'sex'} row>
                    <FormControlLabel value={true} control={<Radio/>}
                                      label={<Avatar sx={{width: 56, height: 56}} src={wosm}/>}/>
                    <FormControlLabel value={false} control={<Radio/>}
                                      label={<Avatar sx={{width: 56, height: 56}} src={wagggs}/>}/>
                </Field>
            </FormControl>
            <Typography variant={'subtitle1'}>E le persone che ti piacciono che distintivo portano?</Typography>
            <Field component={RadioGroup} name={'sexPreference'} row>
                <FormControlLabel value={true} control={<Radio/>}
                                  label={<Avatar sx={{width: 56, height: 56}} src={wosm}/>}/>
                <FormControlLabel value={false} control={<Radio/>}
                                  label={<Avatar sx={{width: 56, height: 56}} src={wagggs}/>}/>
                <FormControlLabel value={''} control={<Radio/>}
                                  label={<img alt={'FIS'} style={{height: 66}} src={fis}/>}/>
            </Field>
            <Box pt={2} display={'flex'} alignItems={'end'} justifyContent={'end'} gap={1}>
                <Button variant='contained' color={'primary'} disabled={sexInput.value === ''}
                        onClick={goNext}>Avanti</Button>
            </Box>
        </Box>
    )
}

function Presentati({goBack, goNext}: StepProps) {
    return (
        <Box border={'2px dashed #257048'} borderRadius={4} px={2} py={1} gap={1}>
            <Typography variant={'subtitle1'}>Ma dimmi chi sei...</Typography>
            <Field sx={{my: 1}} component={TextField} name={'nome'} label={'Nome'} variant={'outlined'}/>
            <Field sx={{my: 1}}
                   component={TextField}
                   name={'descrizione'}
                   label={'Qualcosa su di te'}
                   placeholder={'Racconta qualcosa di interessante su di te'}
                   variant={'outlined'}
                   minRows={2}
                   multiline
                   fullWidth/>
            <Box pt={2} display={'flex'} alignItems={'end'} justifyContent={'end'} gap={1}>
                <Button onClick={goBack}>Indietro</Button>
                <Button variant='contained' color={'primary'} onClick={goNext}>Conferma</Button>
            </Box>
        </Box>
    )
}