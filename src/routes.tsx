import {useRoutes} from 'react-router-dom'

import Layout from './Layout'
import React from "react";
import Signup from "./signup/Signup";
import Home from './home/Home';
import Chat from "./chat/Chat";
import ChatWindow from "./chatWindow/ChatWindow";
import Profilo from './profilo/Profilo';

export default function Router (): React.ReactElement | null {
  const routes = useRoutes([
    {
      path: '/',
      children: [
        {
          path: '/',
          element: <Layout />,
          children: [
            {
              element: <Home />,
              index: true
            },
            {
              element: <Profilo />,
              path: 'profilo'
            },
            {
              element: <Chat />,
              path: 'chat'
            },
          ]
        }
      ]
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/chat/:id',
      element: <ChatWindow />
    }
  ])

  return routes
}
