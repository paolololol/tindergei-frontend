import React, {Fragment, ReactElement, useRef} from "react";
import {Avatar, Box, Button, CircularProgress, FormControlLabel, Radio, Typography} from "@mui/material";
import {useMutation, useQuery} from "react-query";
import {getMe, ProfiloEditModel, updateMe, uploadImage} from "../api/profilo";
import placeholder from '../assets/placeholder.svg'
import {Field, Formik} from "formik";
import {RadioGroup, TextField} from "formik-mui";
import wosm from '../assets/wosm.png'
import wagggs from '../assets/wagggs.png'
import fis from '../assets/fis.png'

export default function Profilo(): ReactElement {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const me = useQuery('me', getMe, {refetchOnWindowFocus: false});
    const uploadImageMutation = useMutation('uploadImage', (image: File) => uploadImage(image), {onSuccess: () => me.refetch()})
    const mutate = useMutation('updateProfile', (values: ProfiloEditModel) => updateMe(values), {onSuccess: () => me.refetch()})
    if (!me.data) return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <CircularProgress/>
        </Box>
    )

    return (
        <Box sx={{overflow: 'auto', height: '100%', px: 2}}>
            <Box sx={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                my: 1,
                flexDirection: 'column',
                width: '100%'
            }}>
                <Avatar src={me.data.avatarPath ?? placeholder} sx={{width: '30%', height: 'auto'}}/>
                <input ref={inputRef} style={{display: 'none'}} type={'file'} accept={'image/*'} onChange={(e) => {
                    if (e.target.files) {
                        uploadImageMutation.mutate(e.target.files[0])
                    }
                }}/>
                <Button onClick={() => inputRef.current?.click()}>{me.data.avatarPath ? 'Cambia' : 'Carica'} immagine</Button>
            </Box>
            <Formik initialValues={{...me.data, sexPreference: me.data.sexPreference == null ? '' : me.data.sexPreference ? 'true' : 'false'}}
                    enableReinitialize
                    onSubmit={(values) => mutate.mutate(values)}>
                {({values, submitForm}) => (
                    <Fragment>
                        <Field sx={{my: 1}} component={TextField} name={'nome'} helperText={'Nome'} variant={'outlined'}
                               fullWidth/>
                        <Field sx={{my: 1}}
                               component={TextField}
                               name={'descrizione'}
                               helperText={'Qualcosa su di te'}
                               placeholder={'Racconta qualcosa di interessante su di te'}
                               variant={'outlined'}
                               minRows={2}
                               multiline
                               fullWidth/>
                        <Typography>La tua preferenza:</Typography>
                        <Field component={RadioGroup} name={'sexPreference'} row>
                            <FormControlLabel value={'true'} control={<Radio/>}
                                            label={<Avatar sx={{width: 56, height: 56}} src={wosm}/>}/>
                            <FormControlLabel value={'false'} control={<Radio/>}
                                            label={<Avatar sx={{width: 56, height: 56}} src={wagggs}/>}/>
                            <FormControlLabel value={''} control={<Radio/>}
                                            label={<img alt={'FIS'} style={{height: 66}} src={fis}/>}/>
                        </Field>
                        <Button disabled={!values.nome} sx={{my: 1}} variant={'contained'} fullWidth onClick={submitForm}>Salva</Button>
                    </Fragment>
                )}
            </Formik>
        </Box>
    )
}
