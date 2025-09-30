import { StatusBar } from 'expo-status-bar';
import { Colors } from "@/constants/theme";
import { Slot } from "expo-router";
import React from "react";
import { Text, View } from "react-native"

const RootLayout = () => {
  return (
    <View style = {{backgroundColor:Colors.background, flex:1}}>
      <Text>Header</Text>
      <Slot />
      <StatusBar style = "light"></StatusBar>
    </View>
  )
}

export default RootLayout