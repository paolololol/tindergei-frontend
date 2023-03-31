import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/montserrat/300.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/700.css'
import './index.css'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './utils/keycloak'
import apiClient from './utils/axios'
// import './firebase'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ReactKeycloakProvider
        authClient={keycloak}
        onTokens={(tokens) => { apiClient.defaults.headers.common.Authorization = `Bearer ${tokens.token}` }}
    >
        <StrictMode>
            <App/>
        </StrictMode>
    </ReactKeycloakProvider>
)
