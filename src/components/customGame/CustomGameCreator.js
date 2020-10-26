// This file describes how the Custom Game Creator page looks and functions

import React, { useRef, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap"
import { CustomGameContext } from "./CustomGameProvider.js"
import { CardContext } from "../card/CardProvider.js"

export const CustomGameCreator = (props) => {

    // --------------- Initializing Variables ----------------

    const { 
        currentUser, 
        addCustomGame, 
        getCustomGames, 
        getCustomGamesByUserId, 
        getCurrentUser, 
        updateCurrentUser, 
        getCustomGameById, 
        getCustomGameByNameAndUserId 
    } = useContext(CustomGameContext);
    const { addCard, getCards } = useContext(CardContext);
    const activeUserId = parseInt(sessionStorage.getItem("activeUser"));

    const [currentCustomGame, setCurrentCustomGame] = useState({});
    const [customCards, setCustomCards] = useState({});

    let unusedCards = 30; // The maximum number of cards a user can add
    // -- decreases each time the user:  
    // ---- saves and parses the input of a textarea
    // ---- (STRETCH: adds a card or list of cards)
    const history = useHistory();

    //const gameNameInput = useRef(null);
    //const charInputs = useRef(null);
    const weaponInputs = useRef(null);
    const roomInputs = useRef(null);
    // initialize and reset captured custom card inputs
    let storedCharInputs, storedWeaponInputs, storedRoomInputs = [];  


    // Handle the form inputs
    const handleControlledGameInputChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newCustomGame = { ...currentCustomGame }
        //article is an object with properties. 
        //set the property to the new value
        newCustomGame[event.target.name] = event.target.value
        //update state
        setCurrentCustomGame(newCustomGame)
    }

    const handleControlledCardInputChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newCard = { ...customCards }
        //article is an object with properties. 
        //set the property to the new value
        newCard[event.target.name] = event.target.value
        //update state
        setCustomCards(newCard)
    }

    


    // ------------------ useEffect ---------------------
    useEffect(() => {
        getCustomGames()
        getCards() 
    }, [])


    // ------------------- Functions --------------------

    // These functions parse input strings to capture the cards the user adds in the form
    // Checks if the number of input items exceeds the possible maximum
    const parseInputCards = (inputString) => {
        let newInputs = [];                         // initialize empty local array to store parsed input string
        if(inputString !== ''){                     // Check if anything was actually typed
            newInputs = inputString.split(',');     // If stuff typed, fill array split by commas
        }
        if (newInputs.length >= 5){                 // Have at least five cards, can add 
            console.log("Can add the cards!");
            console.log("newInputs: ", newInputs);
            return newInputs                        // return parsed cards
        }
        else if (newInputs > 20){                   // Have too many cards of this type
            console.log("Too many cards!");
        }
        else {                                      // Don't have enough cards
            console.log("Too few cards! Need at least 5.");
        }
    }

    const storeCharInputs = () => {
        // save parsed cards in global variable
        console.log("inputLogger --- storeCharInputs(): ");
        inputLogger();
        storedCharInputs = parseInputCards(customCards.charsInputText.trim()); 
    }

    const storeWeaponInputs = () => {
        console.log("inputLogger --- storeWeaponInputs(): ");
        inputLogger();
        // save parsed cards in global variable
        storedWeaponInputs = parseInputCards(customCards.weaponsInputText.trim());
    }

    const storeRoomInputs = () => {
        console.log("inputLogger --- storeRoomInputs(): ");
        inputLogger();
        // save parsed cards in global variable
        storedRoomInputs = parseInputCards(customCards.roomsInputText.trim());
    }


    // This function saves the inputs to the database as individual cards with the corresponding customGameId
    const saveInputCards = (newCustomGameId) => {
        console.log("storedCharInputs: ", storedCharInputs);
        const charCards = storedCharInputs.map(c => {
            return createCustomCardObject(c, "character", newCustomGameId)
        })
        console.log("\ncharCards:\n", charCards);

        const weaponCards = storedWeaponInputs.map(w => {
            return createCustomCardObject(w, "weapon", newCustomGameId)
        })
        console.log("\nweaponCards:\n", charCards);

        const roomCards = storedRoomInputs.map(r => {
            return createCustomCardObject(r, "room", newCustomGameId)
        })

        // concatenate chars array with weapons and rooms to make one array of card objects
        if(charCards.length !== 0 && weaponCards.length !== 0 && roomCards.length !== 0){
            let allCustomCardObjs = charCards.concat(weaponCards, roomCards);
            // Iterate through and add each card to the database with the CORRECT gameId
            for (const card of allCustomCardObjs) {
                addCard(card);
            }
        }
    }

    // Create a card object 
    const createCustomCardObject = (inputStr, typeStr, newGameId) => {
        const newCardObj = {
            name: inputStr,
            type: typeStr,
            gameId: newGameId
        }
        return newCardObj
    }


    /**
     * To load another user's custom game, include a check of the url params
     * - if params contains '/createCustom/:customGameId(\d+)'
     *      - Grab the game and the cards in the db associated with that id
     *      - Populate the input fields (STRETCH or preview area where settings are shown after saving them)
     *      - The 'save settings' button says 'Load Game' or 'Play Game'
     * - else
     *      - Do the whole creating a new custom game thing
     * 
     */



    const inputLogger = () => {

        console.log("gameNameInput: ", currentCustomGame.gameName )
        console.log("customCards.charsInputText: ", customCards.charsInputText )
        console.log("weaponInputs: ", customCards.weaponsInputText )
        console.log("roomInputs: ", customCards.roomsInputText )
    }


    const createNewCustomGameObject = () => {
        console.log("currentCustomGame.gameName: ", currentCustomGame.gameName);
        const newObj = {
            userId: activeUserId,
            gameName: currentCustomGame.gameName,
            isPrivate: true
        }
        console.log("newObj: ", newObj);
        return newObj

    }

    // This function updates the current user's number of created custom games
    // once a new custom game is created.
    const updateMyCustomGames = () => {
        const myGames = getCustomGamesByUserId(activeUserId); // get array of games by the active user
        console.log("myGames: ", myGames);
        const activeUser = getCurrentUser();    // get the active user
        console.log("activeUser: ", activeUser);
        // compare activeUser's # of games to length of games corresponding to activeUser's Id
        if(activeUser.myCustomGames !== myGames.length){ 
            console.log(" MISMATCH ---- update myCustomGames ")
            // If the two don't match, update activeUser's profile
            updateCurrentUser({
                name: activeUser.username,
                myCustomGames: myGames.length, // update the number of custom games the user created
                bestClassicGameId: activeUser.bestClassicGameId, 
                bestClassicGameScore: activeUser.bestClassicGameScore,
                email: activeUser.email

            })
        }
        else {
            console.log(" MATCH ------ apparently the user did not make a new game, but this function was still called...?");
        }
        

    }


     // This function creates the custom game object,
    // uploads the object to the database, 
    // and starts the game with the id of the object just created. 
    const navToPlayGame = () => {
        inputLogger();
        const newCustomGameObj = createNewCustomGameObject() // create local obj to reference for adding cards
        addCustomGame(newCustomGameObj) // add custom game obj to database
        .then(() => {
            // fetch that object to grab it's id
            getCustomGameByNameAndUserId(newCustomGameObj.gameName, newCustomGameObj.userId)
            .then(game => {
                // set the grabbed game to the currentCustomGame in state
                setCurrentCustomGame(game)
            })
        })
        .then(() => {
            // save and add new custom cards to new custom game id
            saveInputCards(currentCustomGame.id)
        })
        .then(() => {
            // update current user's myCustomGames information 
            updateMyCustomGames()
            // navigate to the gameboard for the custom game just created
            history.push(`/play/${currentCustomGame.id}`)
        })
    }


    return (
        <>
            <h1 className="customGameCreator--title">THIS IS THE CUSTOM GAME CREATOR PAGE</h1>
            <div className="customizationForm">
                <Form>
                    <FormGroup>
                        <Label for="gameNameInput">Game Name</Label>
                        <Input type="textarea" name="gameName" id="gameNameInput" onChange={handleControlledGameInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="characterTextInput">Add Characters</Label>
                        <Input type="textarea" name="charsInputText" id="characterTextInput" onChange={handleControlledCardInputChange}/>
                        <Button className="saveCharsBtn" onClick={storeCharInputs}>Save Characters</Button>
                    </FormGroup>
                    <FormGroup>
                        <Label for="weaponTextInput">Add Weapons</Label>
                        <Input type="textarea" name="weaponsInputText" id="weaponTextInput" onChange={handleControlledCardInputChange}/>
                        <Button className="saveWepnsBtn" onClick={storeWeaponInputs}>Save Weapons</Button>
                    </FormGroup>
                    <FormGroup>
                        <Label for="roomTextInput">Add Rooms</Label>
                        <Input type="textarea" name="roomsInputText" id="roomTextInput" onChange={handleControlledCardInputChange}/>
                        <Button className="saveRoomsBtn" onClick={storeRoomInputs}>Save Rooms</Button>
                    </FormGroup>
                </Form>
            </div>


            <div className="playCustomGameBtn--container">
                <button type="button" className="playCustomGameBtn" onClick={navToPlayGame}>Save Settings</button>
            </div>
            <div className="myCustomGameList">List of ALL my custom games </div>
            <div className="publicCustomGameList">List of ALL(?) shared custom games from the community </div>
        </>
    )
}