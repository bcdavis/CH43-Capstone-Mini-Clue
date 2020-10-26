import React from "react"
import { Route } from "react-router-dom"
import { Home } from "./home/Home.js"
import { Header } from "./Header.js"
import { MyProfile } from "./profile/MyProfile.js"
import { HowToPlay } from "./HowToPlay.js"
import { GameBoard } from "./game/GameBoard.js"
import { CustomGameCreator } from "./customGame/CustomGameCreator.js"
import { CustomGameProvider } from "./customGame/CustomGameProvider.js"
import { CardProvider } from "./card/CardProvider.js"

import { ProfileProvider } from "./profile/ProfileProvider.js"

export const ApplicationViews = (props) => {
    const activeUserId = sessionStorage.getItem("activeUser");
    return (
        <>  
            <Route exact path="/">
                <Home />
            </Route>
            
            <CardProvider>
                <Route exact path="/play">
                    <GameBoard />
                </Route>


                <CustomGameProvider>
                    <Route exact path="/createCustom">
                        <CustomGameCreator />
                    </Route>

                    <Route exact path="/play/:customGameId(\d+)">
                        <GameBoard />
                    </Route>
                </CustomGameProvider>
            </CardProvider>


            <Route exact path="/how-to-play">
                <HowToPlay />
            </Route>

            <ProfileProvider>
                <Route exact path="/profile/:userId(\d+)">
                    <MyProfile key={activeUserId}/>
                </Route>
            </ProfileProvider>




            {/* <Route exact path="/logout">
                <Header />
            </Route> */}


        </>
    )
}