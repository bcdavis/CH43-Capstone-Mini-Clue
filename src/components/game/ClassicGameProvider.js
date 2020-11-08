import React, { createContext } from "react"

export const ClassicGameResultsContext = createContext()

export const ClassicGameResultsProvider = (props) => {

    const getBestResultsByUserId = (id) => {
        // Fetch all custom games created by a particular user id
        return fetch(`http://localhost:8088/bestGameResults?userId=${id}`)
            .then(res => res.json())
    }

    const updateBestResults = (newBestResultsObj) => {
        console.log("newBestResultsObj_to_add: ", newBestResultsObj);
        return fetch("http://localhost:8088/bestGameResults", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBestResultsObj) 
        })
        .then(res => res.json()) // return the game results object just uploaded to the database
    }

    const addBestResults = (newBestResultsObj) => {
        console.log("newBestResultsObj_to_add: ", newBestResultsObj);
        return fetch("http://localhost:8088/bestGameResults", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBestResultsObj) 
        })
        .then(res => res.json()) // return the game results object just uploaded to the database
    }



    return (
        <ClassicGameResultsContext.Provider value={{
            getBestResultsByUserId, updateBestResults, addBestResults
        }}>
            {props.children}
        </ClassicGameResultsContext.Provider>
    )
}