// This file describes how the leaderboard itself will render

import React, { useContext, useEffect, useState } from "react"
import { ClassicGameResultsContext } from "../game/ClassicGameProvider.js"
import { LeaderboardEntry } from "./LeaderboardEntry.js"
import "./Leaderboard.css"



export const LeaderboardList = () => {

    const { getAllBestResults } = useContext(ClassicGameResultsContext);

    const [ allResults, setAllResults] = useState([])
    const [ sortedResults, setSortedResults] = useState([])
    let positionCounter = 0;

    useEffect(() => {
        console.log("LeaderboardList: useEffecf -- getAllBestResults")
        getAllBestResults()
        .then(results => {
            setAllResults(results)
        })
    }, [])

    useEffect(() => {
        if(allResults.length !== 0){
            console.log(" useEffect 2 -- allResults: ", allResults);
            setSortedResults(sortResults(allResults))
        }

    
    }, [allResults])


    const sortResults = (bestResultsArray) => {
        let sortedUserResults = bestResultsArray.sort(function(a, b){return b.score - a.score})
        console.log("New sorted results? : ", sortedUserResults);

        return sortedUserResults;
    }


    return (
        <>
            <table id="leaderboard-table">
                <thead>
                    <tr id="tr01">
                        <th>#</th>
                        <th>Username</th>
                        <th>Time (s)</th>
                        <th># Players</th>
                        <th>Remaining Cards</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedResults.map((result) => {
                            positionCounter += 1;
                            return (
                                <>
                                    <tr>
                                        <td>{positionCounter}</td>
                                        <LeaderboardEntry key={result.id} bestResultObj={result}/>
                                    </tr>
                                </>
                            )

                        })
                    }
                    
                </tbody>


            </table>
        </>
    
    )
}
