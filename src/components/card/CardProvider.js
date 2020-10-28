// This file defined functions to grab and use playing cards by their id. 
// This file also contains functions to add new, custom cards to the database

import React, { useState, createContext } from "react"

export const CardContext = createContext()

export const CardProvider = (props) => {
    const [cards, setCards] = useState([])
    const userId = sessionStorage.getItem("activeUser")

    const getCards = () => {
        return fetch(`http://localhost:8088/cards`)
            .then(res => res.json())
            .then(setCards)
    }

    // Cards are added when the settings to a new custom game are saved
    const addCard = cardObj => {
        return fetch("http://localhost:8088/cards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cardObj)
        })
            .then(getCards)
    }

    // Can get all cards of a certain type (character, weapon, or room)
    const getCardsByType = (typeStr) => {
        return fetch(`http://localhost:8088/cards?type=${typeStr}`)
            .then(res => res.json())
            .then(setCards)
    }

    // Grab all the cards that correspond to a particular game Id (classic games have cards with gameId = 0)
    const getCardsByGameId = (gameId) => {
        return fetch(`http://localhost:8088/cards?gameId=${gameId}`)
            .then(res => res.json())
            .then(setCards)
    }

    const getCardsByGameIdAndType = (gameId, typeStr) => {
        console.log(`Grabbing cards of gameId = ${gameId} of type = ${typeStr}`)
        return fetch(`http://localhost:8088/cards?gameId=${gameId}&type=${typeStr}`)
            .then(res => res.json())
            // .then(setCards)
    }

    // Cards are only deleted when the custom game id that they correspond to is also deleted
    const deleteCard = (gameId) => {
        return fetch(`http://localhost:8088/cards?gameId=${gameId}`, {
            method: "DELETE"
        })
            .then(getCards)
    }

    return (
        <CardContext.Provider value={{
            cards, getCards, addCard, getCardsByType, getCardsByGameId, getCardsByGameIdAndType, deleteCard
        }}>
            {props.children}
        </CardContext.Provider>
    )
}