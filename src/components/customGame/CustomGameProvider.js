// This file defines functions to grab a specific user's custom game(s), grab all custom games, and post new custom games

import React, { useState, createContext } from "react"

export const CustomGameContext = createContext()

export const CustomGameProvider = (props) => {
    const [customGames, setCustomGames] = useState([])
    const userId = sessionStorage.getItem("activeUser")

    const getCustomGames = () => {
        return fetch(`http://localhost:8088/customGames`)
            .then(res => res.json())
            .then(setCustomGames)
    }

    // CustomGames are added when the settings to a new custom game are saved
    // Cards associated with the custom game id are also saved
    const addCustomGame = customGameObj => {
        return fetch("http://localhost:8088/customGames", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customGameObj) 
            // the object contains the following: 
            /**
             * {
             *  id:  --- auto generated when posting
             *  userId: 
             *  gameName: 
             *  isPrivate: 
             * }
             */
        })
            .then(res => res.json())
    }

    // Grab a custom game that corresponds to a particular game Id (classic games have CustomGames with gameId = 0)
    const getCustomGameByGameId = (gameId) => {
        return fetch(`http://localhost:8088/customGames?id=${gameId}&_expand=user`)
            .then(res => res.json())
    }

    // Fetch all custom games created by a particular user id
    const getCustomGamesByUserId = (otherUserId) => {
        return fetch(`http://localhost:8088/customGames?userId=${otherUserId}`)
            .then(res => res.json())
    }

    // User can use this function to update the shared status of a custom game
    // AKA -- can change isPrivate to true or false and save changes to database
    const updateCustomGame = (gameObj) => {
        return fetch(`http://localhost:8088/customGames/${gameObj.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gameObj)
        })
            .then(getCustomGameByGameId(gameObj.id))
    }

    // custom games are only deleted when the button to delete a custom game is pressed
    // This SHOULD also delete any cards associated with the custom game id
    const deleteCustomGame = (gameId) => {
        return fetch(`http://localhost:8088/customGames?id=${gameId}`, {
            method: "DELETE"
        })
            .then(getCustomGames)
    }

    return (
        <CustomGameContext.Provider value={{
            customGames, getCustomGames, addCustomGame, getCustomGameByGameId, getCustomGamesByUserId, updateCustomGame, deleteCustomGame
        }}>
            {props.children}
        </CustomGameContext.Provider>
    )
}