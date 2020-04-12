import { ThemeProvider, Heading, Flex, Grid, Box, theme, Button, useToast } from '@chakra-ui/core'
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
  const toast = useToast()
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
    if (toastTitleDesc.title && toastTitleDesc.description) {
      const { title, description } = toastTitleDesc
      toast({
        position: 'bottom-left',
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
    return () => {
      unregisterAuthServer()
    }
  }, [toastTitleDesc, toast])

  // https://github.com/firebase/firebaseui-web-react
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  }

  // const ToastExample = () => {
  //   const toast = useToast()
  //   return (
  //     <Button
  //       onClick={() =>
  //         toast({
  //           position: 'bottom-left',
  //           title: 'Account created.',
  //           description: "We've created your account for you.",
  //           status: 'success',
  //           duration: 9000,
  //           isClosable: true,
  //         })
  //       }>
  //       Show Toast
  //     </Button>
  //   )
  // }

  const deleteCurrentUser = async () => {
    try {
      await firebase.auth().currentUser.delete()
      toast({
        title: 'Successfully Deleted the account',
        description: 'Your account was deleted',
        status: 'success',
      })
    } catch (e) {
      // setToastTitleDesc({ title: 'Failed to delete', description: 'assss' })
      // toast({
      //   title: 'Failed to delete the account',
      //   description: 'aaaa',
      //   duration: 9000,
      //   isClosable: true,
      //   status: 'error',
      // })
      toast({
        position: 'bottom-left',
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      console.log('aieee')
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
          <Heading as='h1'>My Item List</Heading>
          {/* <ToastExample /> */}
          {isSignedIn && <Flex>{username}</Flex>}
          {isSignedIn && <Button onClick={() => deleteCurrentUser()}>delete</Button>}
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
      <div>
        {/* <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"></script>

<script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-analytics.js"></script>

<script>
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script> */}
      </div>
    </ThemeProvider>
  )
}

export default Home
