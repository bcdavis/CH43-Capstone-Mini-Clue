import React from "react"
import { Route, useParams } from "react-router-dom"
import { Home } from "./home/Home.js"
import { Header } from "./Header.js"
//import { MyProfile } from "./profile/MyProfile.js"
import { HowToPlay } from "./HowToPlay.js"
import { GameBoard } from "./game/GameBoard.js"
import { CustomGameCreator } from "./customGame/CustomGameCreator.js"
import { CustomGameProvider } from "./customGame/CustomGameProvider.js"
import { CardProvider } from "./card/CardProvider.js"
import { ClassicGameResultsProvider } from "./game/ClassicGameProvider.js"

//import { ProfileProvider } from "./profile/ProfileProvider.js"

export const ApplicationViews = (props) => {
    const activeUserId = sessionStorage.getItem("activeUser");
    return (
        <>  
            <Route exact path="/">
                <Home />
            </Route>
            
            <CardProvider>
                <CustomGameProvider>
                    <ClassicGameResultsProvider>
                        <Route exact path="/play">
                            <GameBoard />
                        </Route>

                        <Route exact path="/play/:customGameId(\d+)">
                            <GameBoard />
                        </Route>
                    </ClassicGameResultsProvider>

                    <Route exact path="/createCustom">
                        <CustomGameCreator />
                    </Route>
                </CustomGameProvider>
            </CardProvider>


            <Route exact path="/how-to-play">
                <HowToPlay />
            </Route>

            {/* <ProfileProvider>
                <Route exact path="/profile/:userId(\d+)">
                    <MyProfile key={activeUserId}/>
                </Route>
            </ProfileProvider> */}


        </>
    )
}