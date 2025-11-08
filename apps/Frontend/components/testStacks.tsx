import { View, Text } from 'react-native'
import React from 'react'
import { Auth0Provider } from 'react-native-auth0'
import { Stack } from 'expo-router'

const TestStacks = () => {
  return (
    <Auth0Provider
    domain={"dev-pqfoyphs7qp6u38e.uk.auth0.com"}
    clientId={process.env.EXPO_PUBLIC_AUTHO_CLIENT_ID!}
  >
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false ,}} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  </Auth0Provider>
  )
}

export default TestStacks