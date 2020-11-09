import React, { createContext } from "react"

export const ClassicGameResultsContext = createContext()

export const ClassicGameResultsProvider = (props) => {

    //const [currentHighScore, setCurrentHighScore] = useState([])

    const getBestResultsByUserId = (id) => {
        // Fetch all custom games created by a particular user id
        return fetch(`http://localhost:8088/bestGameResults?userId=${id}`)
            .then(res => res.json())
    }

    const getAllBestResults = () => {
        console.log("Getting all best results")
        // Fetch all classic game results
        return fetch(`http://localhost:8088/bestGameResults/?_expand=user`)
            .then(res => res.json())
    }
    

    const updateBestResults = (existingBestResultsId, newBestResultsObj) => {
        //console.log("newBestResultsObj_to_add: ", newBestResultsObj);
        return fetch(`http://localhost:8088/bestGameResults/${existingBestResultsId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBestResultsObj) 
        })
        .then(res => res.json()) // return the game results object just uploaded to the database
    }

    const addBestResults = (newBestResultsObj) => {
        //console.log("newBestResultsObj_to_add: ", newBestResultsObj);
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
            getBestResultsByUserId, getAllBestResults, updateBestResults, addBestResults
        }}>
            {props.children}
        </ClassicGameResultsContext.Provider>
    )
}