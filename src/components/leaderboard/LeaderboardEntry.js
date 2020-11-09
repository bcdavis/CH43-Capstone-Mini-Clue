// tdis file describes how a user's highest scoring classic game will be rendered
// in tde leaderboard (best game list) section.

import React from "react"

export const LeaderboardEntry = ({bestResultObj}) => {


    return (
        <>
                <td>{bestResultObj.user.name}</td>
                <td>{bestResultObj.completionTime}</td>
                <td>{bestResultObj.players}</td>
                <td>{bestResultObj.accusables}</td>
                <td>{bestResultObj.score}</td>

        </>
    )
}