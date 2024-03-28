import { Text,View } from "react-native";
import React from "react";
import {NavigationContainer} from '@react-navigation/native'
import HomeScreen from "../screens/HomeScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack"

const Stack=createNativeStackNavigator();
export default function AppNavigation() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                
                <Stack.Screen name="Home" options={{headerShown:false}} component={HomeScreen}/>
               
            </Stack.Navigator>
        </NavigationContainer>
    )
}