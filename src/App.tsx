import Router from './routes'
import { BrowserRouter } from 'react-router-dom'
import React, { ReactElement, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useKeycloak } from '@react-keycloak/web'
import {createTheme, ThemeProvider} from "@mui/material";
import createTypography from "@mui/material/styles/createTypography";
import createPalette from "@mui/material/styles/createPalette";

const queryClient = new QueryClient()

const palette = createPalette({primary: {main: '#257048'}})
const typography = createTypography(palette, {fontFamily: 'Montserrat'});
const theme = createTheme({typography, palette})

export default function App (): ReactElement {
  const { initialized, keycloak } = useKeycloak()

  useEffect(() => {
    if (initialized && !keycloak?.authenticated) {
      keycloak.login()
    }
  }, [initialized, keycloak])

  if (!initialized || !keycloak?.authenticated) {
    return <div>...</div>
  }

  return (
      <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Router/>
            </BrowserRouter>
          </QueryClientProvider>
      </ThemeProvider>
  )
}
