import { View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { theme } from '../theme'
import React from 'react'
import { MagnifyingGlassIcon, CalendarDaysIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { useState, useCallback,useEffect } from "react";
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import * as Progress from 'react-native-progress'
import { getData, storeData } from "../utils/asyncStorage";

export default function HomeScreen() {

    const [showSearch, toggleSearch] = useState(false)
    const [loactions, setLocations] = useState([])
    const [weather, setWeather] = useState({})
    const [forecastData, setForecastData] = useState([]);
    const [loading,setLoading]=useState(true)


    const handleLocation = (loc) => {
        // console.log("Location: ", loc)
        setLocations([])
        setLoading(true)
        toggleSearch(false)
        fetchWeatherForecast({
            cityName: loc.name,
            days: "7"
        }).then(data => {
            // console.log("Weather data: ", data)
            setWeather(data)
            setLoading(false)
            storeData('city',loc.name)
            // console.log("Got data ", data)
            // setForecastData(data.forecast.forecastday); // Set forecast data here
            // console.log("Got forecastdata ", data.forecast.forecastday)
        })
    }

    const handleSearch = value => {
        // console.log("Value: ",value)
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                // console.log("Dtaa: ",da
                setLocations(data)
            })
        }
    }

    useEffect(() => {
      fetchMyWeatherData()
    }, [])

    const fetchMyWeatherData=async()=>{
        let myCity=await getData('city')
        let cityName='Mumbai'
        if(myCity)cityName=myCity
fetchWeatherForecast({
    cityName:"Mumbai",
    day:'7',
}).then(data=>{
    console.log("seven days: ",data)
    setWeather(data)
    setLoading(false)
})
    }
    
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])


    const { current, location } = weather

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image blurRadius={1}
                // style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
                className="absolute h-full w-full "
                source={require('../assets/bgimage.jpeg')}
            />
{/* loadingbar */}
{
    loading?(
        <View className="flex-1 justify-center items-center flex-row">
            <Progress.CircleSnail size={140} thickness={10} />
            {/* <Text className="text-white text-4xl">Loading...</Text> */}
        </View>
    ):(
    <SafeAreaView className="flex flex-1">

    {/* Search Section */}
    <View style={{ height: '7%' }} className="mx-4 relative z-50">
        <View className="flex-row justify-end items-center rounded-full  mt-5"
            style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent" }}>
            {showSearch ?
                (
                    <TextInput
                        onChangeText={handleTextDebounce}
                        placeholder="Search City"
                        placeholderTextColor={'lightgray'}
                        className="flex-1 h-10 pl-6 text-base text-white"

                    />) : null
            }
            <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="rounded-full p-3 m-1">
                <MagnifyingGlassIcon color="white" size={25} />
            </TouchableOpacity>
        </View>

        {
            loactions.length > 0 && showSearch ? (
                <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                    {
                        loactions.map((loc, index) => {
                            let showBorder = index + 1 != loactions.length
                            let borderClass = showBorder ? "border-b-2 border-b-gray-400" : " "
                            return (
                                <TouchableOpacity
                                    onPress={() => handleLocation(loc)}
                                    key={index}
                                    className={"flex-row items-center border-0 p-3 mb-1 px-4 " + borderClass}
                                >
                                    <MapPinIcon color='gray' size="20" />
                                    <Text className="text-black ml-2 text-lg">{loc?.name},{loc?.country}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            ) : null
        }
    </View>

    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        {/* Forecast Section */}
        <View className="mx-4 flex justify-around flex-1 mb-2 mt-5">

            {/* Location */}

            <Text className="text-white text-center text-2xl font-bold">
                {location?.name},
                <Text className="text-lg font-semibold text-gray-300">
                    {" " + location?.country}
                </Text>
            </Text>

            {/* Weather Image */}
            <View
                // style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                className="flex-row justify-center">
                <Image
                    className="w-52 h-52"
                    source={{ uri: `https:` + current?.condition?.icon }}
                // source={require('../assets/partlycloudy.jpg')}
                />
            </View>
            {/* degree celcius */}
            <View className="space-y-2">
                <Text className="text-center font-bold text-white text-6xl ml-5">
                    {current?.temp_c}&#176;C
                </Text>
                <Text className="text-center  text-white text-xl text-semibold tracking-widest">
                    {current?.condition?.text}
                </Text>
            </View>

            {/* Other Stats */}
            <View className="flex-row justify-between mx-4">
                <View className="flex-row space-x-2 items-center">

                    <Image
                        // source={{uri:`https:`+current?.condition?.icon}}
                        // source={{uri:`https://cdn.weatherapi.com/weather/64x64/night/143.png`}}
                        source={require('../assets/wind.webp')}
                        className="h-10 w-10"
                    />
                    <Text className="text-white font-semibold text-base">
                        {current?.wind_kph}km
                    </Text>
                </View>

                <View className="flex-row space-x-2 items-center">
                    <Image
                        // source={{uri:`https:`+current?.condition?.icon}}
                        source={require('../assets/drop.png')} x
                        className="h-10 w-10"
                    />
                    <Text className="text-white font-semibold text-base">
                        {current?.humidity}%
                    </Text>
                </View>

                <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/sun.png')}
                        className="h-10 w-10"
                    />
                    <Text className="text-white font-semibold text-base">
                        {weather?.forecast?.forecastday[0]?.astro?.sunrise} 
                    </Text>
                </View>
            </View>

            {/* forecast for next days */}
            <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                    <CalendarDaysIcon size='22' color='white' />
                    <Text className="text-white text-base">Daily Forecast</Text>
                </View>

                <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    showsHorizontalScrollIndicator={false}
                >
                    {weather?.forecast?.forecastday?.map((item, index) => {
                        let date=new Date(item.date)
                        let options={weekday:'long'}
                        let dayName=date.toLocaleDateString('en-US',options)
                            dayName.split(',')[0]
                        return (
                            <View
                                key={index}
                                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                                style={{ backgroundColor: theme.bgWhite(0.15) }}
                            >
                                <Image 
                                source={{ uri: `https:` + current?.condition?.icon }}
                                // source={require('../assets/sun.png')} 
                                className="h-11 w-11" />
                                <Text className="text-white">{dayName}</Text>
                                <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>

                            </View>
                        )
                    })}
                </ScrollView>

            </View>
        </View>
    </KeyboardAvoidingView>
</SafeAreaView>)
}
            
        </View>

    )
}
