import axios from "../utils/axios";

export function likePerson(tessera: string): Promise<boolean> {
    return axios.post(`/chat/like/${tessera}`).then(x => x.data)
}

interface ChatViewModel {
    id: string,
    tessera1: string
    tessera2: string
    lastMessage: string | null
    messages: Array<{sender: string; sentAt: string; receivedAt: string; message: string}>
}

export function getChats(): Promise<ChatViewModel[]> {
    return axios.get(`/chat`).then(x => x.data)
}

export function sendMessage(chatId: string, message: string): Promise<void> {
    return axios.post(`/chat/${chatId}`, null, {params: {message}}).then(x => x.data)
}
