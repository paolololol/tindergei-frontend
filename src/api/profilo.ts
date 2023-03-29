import axios from "../utils/axios";

export interface ProfiloViewModel {
    tessera: string,
    nome: string,
    sezione: string,
    avatarPath: string,
    descrizione: string
}

export interface ProfiloCreateModel {
    nome: string
    descrizione: string
    sex: string
    sexPreference: string
}

export interface ProfiloEditModel {
    nome: string;
    descrizione: string;
}

export async function getMe(): Promise<ProfiloViewModel> {
   return axios.get("/profilo/me").then(x => x.data)
}

export async function signup(model: ProfiloCreateModel): Promise<ProfiloViewModel> {
   return axios.put("/profilo/me", {
       nome: model.nome,
       descrizione: model.descrizione,
       sex: model.sex === 'true',
       sexPreference: model.sexPreference === '' ? null : model.sexPreference === 'true'
   }).then(x => x.data)
}

export async function updateMe(model: ProfiloEditModel): Promise<void> {
    return axios.patch("/profilo/me", {
        nome: model.nome,
        descrizione: model.descrizione,
    }).then(x => x.data)
}

export async function getAvailable(): Promise<ProfiloViewModel[]> {
    return axios.get("/profilo").then(x => x.data.reverse())
}

export async function getMatches(): Promise<ProfiloViewModel[]> {
    return axios.get("/profilo/matches").then(x => x.data.reverse())
}

export async function uploadImage(image: File): Promise<void> {
    const formData = new FormData();
    formData.set('file', image);
    return axios.put("/profilo/avatar", formData, {headers: {"Content-Type": "multipart/form-data"}}).then(x => x.data)
}
