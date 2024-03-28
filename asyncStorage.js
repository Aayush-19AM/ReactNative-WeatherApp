import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeData=async(key,value)=>{
    try {
        await AsyncStorage.setItem(key,value)
    } catch (error) {
        console.log("Error Storing the value ",error)
    }
}

export const getData=async(key)=>{
try {
    const value=AsyncStorage.getItem(key)
    return value
} catch (error) {
    console.log("Error receiving value: ",error)
}
}