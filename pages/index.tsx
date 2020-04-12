import { Heading, Flex, Grid, Box, theme, Button, useToast, Icon, useToastOptions } from '@chakra-ui/core'
import { ThemeProvider } from 'emotion-theming'
import React, { useEffect, useState, FC } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import Head from 'next/head'

const firebaseConfig = {
  apiKey: 'AIzaSyDcLHJ8OCjodm7YuHjptPwIuP7pyWGThao',
  authDomain: 'show-my-items.firebaseapp.com',
  databaseURL: 'https://show-my-items.firebaseio.com',
  projectId: 'show-my-items',
  storageBucket: 'show-my-items.appspot.com',
  messagingSenderId: '1068104435908',
  appId: '1:1068104435908:web:0f057b3bc02405eea6e191',
  measurementId: 'G-FLYQ6B2B2Y',
}
const firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig)

const Home: FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [username, setUsername] = useState('')

  const [toastTitleDesc, setToastTitleDesc] = useState({ title: '', description: '' })
  const unregisterAuthServer = firebase.auth().onAuthStateChanged((user: firebase.User) => {
    setIsSignedIn(!!user)
    if (user) {
      setUsername(user.email)
    }
  })

  useEffect(() => {
    return () => {
      unregisterAuthServer()
    }
  }, [])

  // https://github.com/firebase/firebaseui-web-react
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  }

  const ToastExample = () => {
    const toast = useToast()
    return (
      <Button
        onClick={() =>
          toast({
            position: 'bottom-left',
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }>
        Show Toast
      </Button>
    )
  }

  const DeleteButton = () => {
    const toast = useToast()
    return (
      <Button
        onClick={() => {
          deleteCurrentUser(toast)
        }}>
        delete
      </Button>
    )
  }

  const deleteCurrentUser = async (toast: (useToastOptions: useToastOptions) => void) => {
    try {
      await firebase.auth().currentUser.delete()
      toast({
        title: 'Successfully deleted the account',
        description: 'Your account was deleted',
        status: 'success',
      })
    } catch (e) {
      toast({
        title: 'Failed to delete the account',
        description: e.message,
        status: 'error',
      })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Show my items</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Flex direction='column'>
        <Box as='main'>
          <Icon name='phone' />
          <Heading as='h1'>My Item List</Heading>
          {isSignedIn && <Flex>{username}</Flex>}
          {isSignedIn && <DeleteButton />}
          {isSignedIn ? 'signedIn' : 'Not signed in'}

          {!isSignedIn && <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />}

          {isSignedIn && <Button onClick={() => firebaseApp.auth().signOut()}>Sign out</Button>}

          <p className='description'>
            Get started by editing <code>pages/index.js</code>
          </p>
        </Box>

        <Box as='footer' display={{ md: 'flex' }}>
          About: abc
        </Box>
      </Flex>
    </ThemeProvider>
  )
}

export default Home
