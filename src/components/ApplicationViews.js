import React from "react"
import { Route } from "react-router-dom"
import { Home } from "./home/Home.js"
import { Header } from "./Header.js"
import { MyProfile } from "./profile/MyProfile.js"
import { HowToPlay } from "./HowToPlay.js"
import { GameBoard } from "./game/GameBoard.js"
import { CustomGameCreator } from "./customGame/CustomGameCreator.js"
import { CustomGameProvider } from "./customGame/CustomGameProvider.js"

export const ApplicationViews = (props) => {
    return (
        <>  
            <Route exact path="/">
                <Home />
            </Route>
            

            <Route exact path="/play">
                <GameBoard />
            </Route>

            <CustomGameProvider>
                <Route exact path="/createCustom">
                    <CustomGameCreator />
                </Route>
            </CustomGameProvider>


            <Route exact path="/how-to-play">
                <HowToPlay />
            </Route>

            <Route exact path="/profile/:userId(\d+)">
                <MyProfile />
            </Route>




            {/* <Route exact path="/logout">
                <Header />
            </Route> */}


        </>
    )
}