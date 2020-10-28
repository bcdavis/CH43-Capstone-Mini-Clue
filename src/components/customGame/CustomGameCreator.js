// This file describes how the Custom Game Creator page looks and functions

import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"
import { CustomGameContext } from "./CustomGameProvider.js"
import { CardContext } from "../card/CardProvider.js"

export const CustomGameCreator = (props) => {

    // --------------- Initializing Variables ----------------

    const { addCustomGame, getCustomGames } = useContext(CustomGameContext);
    const { addCard, getCards } = useContext(CardContext);
    const activeUserId = parseInt(sessionStorage.getItem("activeUser"));

    const [currentCustomGame, setCurrentCustomGame] = useState({});
    const [customCards, setCustomCards] = useState({});
    // customCards is an object with three attributes:
    /**
     * - charsInputText -- records the input string from the characters textarea
     * - weaponsInputText -- records the input string from the weapons textarea
     * - roomsInputText -- records the input string from the rooms textarea
     */

    // initialize empy arrays for the storage of card inputs
    //const [storedCharInputs, setStoredCharInputs] = useState({});
    //const [storedWeaponInputs, setStoredWeaponInputs] = useState([]);
    //const [storedRoomInputs, setStoredRoomInputs] = useState([]);
    //const [currentUser, setCurrentUser] = useState({})

    //let unusedCards = 30; // The maximum number of cards a user can add
    // -- decreases each time the user:  
    // ---- saves and parses the input of a textarea
    // ---- (STRETCH: adds a card or list of cards)
    const history = useHistory();

    //const gameNameInput = useRef(null);
    //const charInputs = useRef(null);
    //const weaponInputs = useRef(null);
    //const roomInputs = useRef(null);
    // initialize and reset captured custom card inputs
    let storedCharInputs1, storedWeaponInputs1, storedRoomInputs1 = [];  


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
        const newInputs = { ...customCards }
        console.log("newInputs = { ...customCards }: ", newInputs);
        //article is an object with properties. 
        //set the property to the new value
        newInputs[event.target.name] = event.target.value
        console.log("newInputs: ", newInputs);
        //update state
        setCustomCards(newInputs)
    }



    /*
    const handleControlledCharCardInputChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newInputs = { ...storedCharInputs }
        console.log("newCharInputs = { ...storedCharInputs }: ", newInputs);
        //article is an object with properties. 
        //set the property to the new value
        newInputs[event.target.name] = event.target.value
        console.log("newCharInputs: ", newInputs);
        //update state
        setStoredCharInputs(newInputs)
    }
    
    const handleControlledWeaponCardInputChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newInputs = { ...storedWeaponInputs }
        console.log("newInputs = { ...storedWeaponInputs }: ", newInputs);
        //article is an object with properties. 
        //set the property to the new value
        newInputs[event.target.name] = event.target.value
        console.log("newWeaponInputs: ", newInputs);
        //update state
        setStoredWeaponInputs(newInputs)
    }

    const handleControlledRoomCardInputChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newInputs = { ...storedRoomInputs }
        console.log("newInputs = { ...storedRoomInputs }: ", newInputs);
        //article is an object with properties. 
        //set the property to the new value
        newInputs[event.target.name] = event.target.value
        console.log("newRoomInputs: ", newInputs);
        //update state
        setStoredRoomInputs(newInputs)
    }
*/
    


    // ------------------ useEffect ---------------------
    useEffect(() => {
        getCustomGames()
        getCards() 
    }, [])


    // ------------------- Functions --------------------

    // These functions parse input strings to capture the cards the user adds in the form
    // Checks if the number of input items exceeds the possible maximum
    const parseInputCards = (inputString) => {
        console.log("-------------------------\n - parseInputCards()")
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
        console.log("-------------------------\n - storeCharInputs()")
        // save parsed cards in state variable
        storedCharInputs1 = parseInputCards(customCards.charsInputText.trim());
        // console.log("storedCharInputs1: ", storedCharInputs1);
        // console.log("customCards: ", customCards);

    }

    const storeWeaponInputs = () => {
        console.log("-------------------------\n - storeWeaponInputs()")
        // save parsed cards in state variable
        storedWeaponInputs1 = parseInputCards(customCards.weaponsInputText.trim());
        // console.log("storedWeaponInputs1: ", storedWeaponInputs1);
        // console.log("storedWeaponInputs: ", customCards);
    }

    const storeRoomInputs = () => {
        console.log("-------------------------\n - storeRoomInputs()")
        // save parsed cards in state variable
        storedRoomInputs1 = parseInputCards(customCards.roomsInputText.trim());
        // console.log("storedRoomInputs1: ", storedRoomInputs1);
        // console.log("storedRoomInputs: ", customCards);
    }



    // This function saves the inputs to the database as individual cards with the corresponding customGameId
    const saveInputCards = (newCustomGameId) => {
        console.log("-------------------------\n - saveInputCards()")
        // console.log("currentCustomGame: ", currentCustomGame);
        console.log("saveInputCards() --> newCustomGameId: ", newCustomGameId);

        //customCards.charsInputText = storedCharInputs1;
        //customCards.weaponsInputText = storedWeaponInputs1;
        //customCards.roomsInputText = storedRoomInputs1;

        console.log("customCards: ", customCards);

        console.log("storedCharInputs1: ", storedCharInputs1);
        console.log("storedWeaponInputs1: ", storedWeaponInputs1);
        console.log("storedRoomInputs1: ", storedRoomInputs1);

        const charCards = storedCharInputs1.map(c => {
            return createCustomCardObject(c, "character", newCustomGameId)
        })
        console.log("\ncharCards:\n", charCards);

        const weaponCards = storedWeaponInputs1.map(w => {
            return createCustomCardObject(w, "weapon", newCustomGameId)
        })
        console.log("\nweaponCards:\n", weaponCards);

        const roomCards = storedRoomInputs1.map(r => {
            return createCustomCardObject(r, "room", newCustomGameId)
        })
        console.log("\nroomCards:\n", roomCards);

        // concatenate chars array with weapons and rooms to make one array of card objects
        if(charCards.length !== 0 && weaponCards.length !== 0 && roomCards.length !== 0){
            //console.log("\nAll card arrays are not empty ---- join them together\n");
            let allCustomCardObjs = charCards.concat(weaponCards, roomCards);
            //console.log("\nallCustomCardObjs: ", allCustomCardObjs);
            // Iterate through and add each card to the database with the CORRECT gameId

            // This bit of code was suggested online to allow more event listeners to operate at once
            // so the json-server error: 

            /* (node:38613) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 
            11 uncaughtException listeners added to [process]. Use emitter.setMaxListeners() to increase limit
            */ 

            // doe not get thrown. The code temporarily adds more (at least one more) listeners to handle 
            // extra listening. Adding a bunch of cusom game cards at once seems to make json-server
            // think that there's a memory leak since so much information is getting added to the database...?

/*
            emitter.setMaxListeners(emitter.getMaxListeners() + 1);
                emitter.once('event', () => {
                // do stuff
                emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
            });
*/


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



    // const inputLogger = () => {
    //     console.log("   gameNameInput: ", currentCustomGame.gameName )
    //     console.log("   customCards.charsInputText: ", customCards.charsInputText )
    //     console.log("   weaponInputs: ", customCards.weaponsInputText )
    //     console.log("   roomInputs: ", customCards.roomsInputText )
    // }


    const createNewCustomGameObject = () => {
        console.log("-------------------------\n - createNewCustomGameObject()")
        //console.log("currentCustomGame.gameName: ", currentCustomGame.gameName);
        const newObj = {
            userId: activeUserId,
            gameName: currentCustomGame.gameName,
            isPrivate: true
        }
        //console.log("newObj: ", newObj);
        return newObj

    }


     // This function creates the custom game object,
    // uploads the object to the database, 
    // and starts the game with the id of the object just created. 
    const navToPlayGame = () => {
        debugger;
        console.log("-------------------------\n - navToPlayGame()")
        //inputLogger();
        const newCustomGameObj = createNewCustomGameObject() // create local obj to reference for adding cards
        addCustomGame(newCustomGameObj) // add custom game obj to database
        .then(newGame => {
            // save and add new custom cards to new custom game id
            saveInputCards(newGame.id);
            // navigate to the gameboard for the custom game just created
            history.push(`/play/${newGame.id}`);
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