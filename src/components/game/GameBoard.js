// This file describes the functionality and the appearance of the playable game area
// This page is accessed by either clicking the "New Game" button for the classic game mode
// or by creating a new custom game and then clicking "save settings" button. 

import React, { useContext, useEffect, useState, useRef } from "react"
//import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
//import { useParams } from "react-router-dom"
import { useHistory } from 'react-router-dom';
import { CardContext } from "../card/CardProvider.js"
import { CardHTML } from "../card/Card.js"
import { ClassicGameResultsContext } from "./ClassicGameProvider.js"
import { AccusationHTML } from "./functions/accusation.js"
import { setup } from "./functions/setup.js"
import { getScore } from "./functions/score.js"
import Modal from 'react-modal';
import "./Game.css"


export const GameBoard = (props) => {

    const { cards, getCardsByGameId, getCardsByGameIdAndType } = useContext(CardContext)
    const { getBestResultsByUserId, updateBestResults, addBestResults} = useContext(ClassicGameResultsContext)

    //const [currentGame, setCurrentGame] = useState({})
    //const [gameResults, setGameResults] = useState() // used to set the game results at the end of a game
    const activeUserId = sessionStorage.getItem("activeUser");
    const history = useHistory();
    

    // ------------- Game State Variables -----------------

    const [flag, setFlag] = useState(false)

    // These three variables will be changed as the game is played and options are narrowed down
    const [charCardArr, setCharCardArr] = useState([])
    const [weaponCardArr, setWeaponCardArr] = useState([])
    const [roomCardArr, setRoomCardArr] = useState([])

    // These three variabels will permanently hold all the cards of the game
    const [allCharacters, setAllCharacters] = useState([])
    const [allWeapons, setAllWeapons] = useState([])
    const [allRooms, setAllRooms] = useState([])


    // object which will store the three arrays of card types for a classic game
    const [accusedCards, setAccusedCards] = useState({
        accusedChar: "",
        accusedWeapon: "",
        accusedRoom: ""
    });

    // object which will store the three cards of information about the culprit
    const [culprit, setCulprit] = useState({})

    const [gameOver, setGameOver] = useState(false)

    const [numPlayers, setNumPlayers] = useState(0) // set via a prompt in the 2nd useEffect

    const [playerList, setPlayerList] = useState([])

    const [gameTimer, setGameTimer] = useState(0) // initial timer state

    const [gameScore, setGameScore] = useState(0)

    const [modalIsOpen, setIsOpen] = useState(false)

    var subtitle;

    //const startTime = useRef(null);
    //const stopTime = useRef(null);
    //const timeDiff = useRef(null);


    //let startTime = 0;
    //let endTime = 0;
    //let timeDiff = 0;

    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState("startTime above, timeDiff below?");
    const [timeDiff, setTimeDiff] = useState();

    const [game, setGame] = useState({
        userId: null,
        characters: null,
        weapons: null,
        rooms: null,
        players: null,
        completionTime: null,
        accusables: [],
        score: null
    })

    // ----------------------------------------------------

    useEffect(() => {
        if(flag === false){
            console.log("flag: ", flag)
            getCardsByGameId(0)
            // User is going to play a classic game, 
            // create new object to hold the game results
            // fetch the classic game cards
            getCardsByGameIdAndType(0, "character") // sets the 'cards' variable with cards with gameId = 0
            .then(setCharCardArr)

            getCardsByGameIdAndType(0, "weapon")
            .then(setWeaponCardArr)

            getCardsByGameIdAndType(0, "room")
            .then(setRoomCardArr)

            setFlag(true)
        }   
    }, [])

    useEffect(() => {
        var numberOfPlayers = prompt("How many people are playing? (2 - 6)", "2");
        console.log("number of players? : ", numberOfPlayers);
        setNumPlayers(numberOfPlayers);
        setStartTime(performance.now())
    }, [])


    useEffect(() => {
        if(numPlayers > 0){
            console.log("numPlayers: ", numPlayers)
            timerToggle(true)
        }
    }, [numPlayers])


    // SO UNNECESSARY .... 

    useEffect(() => {
        if(flag === true){
            console.log("flag: ", flag)
            getCardsByGameIdAndType(0, "character") // sets the 'cards' variable with cards with gameId = 0
            .then(setAllCharacters)

            getCardsByGameIdAndType(0, "weapon")
            .then(setAllWeapons)

            getCardsByGameIdAndType(0, "room")
            .then(setAllRooms)
        }
    }, [flag])

    useEffect(() => {
        if(!culprit){
            //console.log("culprit should not exist: ", culprit)
            setCulprit({
                who: "",
                what: "",
                where: ""
            })
        }
        else{
            //console.log("culprit should exist: ", culprit)
            if((allCharacters.length > 0) && (allWeapons.length > 0) && (allRooms.length > 0)){
                //console.log("All card arrays should have something in them by now")
                generateRandomCulprit()

            }
        } 
    }, [allCharacters, allWeapons, allRooms])


    // when game is finished, check results and upload new high score if necessary
    useEffect(() => {
        console.log("useEffect -- gameOver: ", gameOver);
        //console.log("useEffect -- gameOver: ", gameOver);
        if(gameOver === true) {
            console.log("gameOver is TRUE")
            if(game.score !== null){
                console.log("game.score is NOT null")
                // game is over, check if active user's current bestGameResult score is higher or lower than current game score

                getBestResultsByUserId(activeUserId)
                .then(result => {
                    compareGameResults(result, game)
                })
            }

        }
    }, [game, gameOver])




    // Handle the form inputs
    const handleControlledAccuseSelectChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newAccusedCards = { ...accusedCards }
        //article is an object with properties. 
        //set the property to the new value
        newAccusedCards[event.target.name] = event.target.value
        //update state
        setAccusedCards(newAccusedCards)
    }


    const compareGameResults = (existingResults, currentResults) => {
        console.log("existingResults: ", existingResults)
        console.log("currentResults: ", currentResults)
        // existingResults is an object inside a one-element array, access obj with [0]
        // both parameters are objects, so access score with .score
    
        // does the existing game exist?
        if(existingResults[0]){
            // then the existing results must include a score to compare
            console.log("existingResults score: ", Number(existingResults[0].score))
            console.log("currentResults score: ", currentResults.score)

            if(currentResults.score >= Number(existingResults[0].score)){
                // if the current score is as high or higher than the existing score, update the user's best Classic game results
                console.log("New high score: ", currentResults.score)
                updateBestResults(existingResults[0].id, currentResults)

            }
            else{
                console.log("High score: ", Number(existingResults[0].score))
            }

        }
        else{
            // existing score does not exist, so just add currentResults to database
            console.log("User's first game results!")
            addBestResults(currentResults)
            
        }
    }


    // ----------------------- Accusation Section ------------------------
/*
    const makeAccusation = ( playerlist_withCards) => { 

        // let allCharacters = charCards;
        // let allWeapons = weaponCards;
        // let allRooms = roomCards; 
        let accuseArray = [accusedCards.accusedChar, accusedCards.accusedWeapon, accusedCards.accusedRoom]
    

        // tryWin sets gameOver so the accusing whileloop can halt. 
        // tryWin also returns the final, non-disproved accusation 
        const tryWin = (accuseArr) => {
            setGameOver(true)
            return accuseArr;
        };
    
        // errMsg returns an array of three zeros after checking all player's hands 
        // and the accusation is disproven
        const errMsg = () => {             
            console.log("Accusation Disproved. Go Again.");
            setGameOver(false)
            return [0,0,0];
        }; 
    
        // Local scope variables. 
        var suspicion = {
            selfDisproved: false,       // if cards in the accuser's hand can disproce accusation, set to true
            disproved: false            // if cards in another player's hand can disprove accusation, set to true 
        };
        // a tracks the number player which is currently being checked to potentially disprove the accusation
        var a = 0;
        
        console.log(playerlist_withCards[a].name + " accuses "+ accuseArray[0]+" with the "+accuseArray[1]+" in the "+accuseArray[2]+"!");


        // Check against the accuser's own cards first. 
        // If any of the accused items are in the accuser's hand, suspicion.selfDisproved is set to true.
        // However, the item disproved is not removed from its accusable array.
        // This resembles the ability to accuse anything in your hand at any time to find out
        // the specific cards of other players. 
        for(var u = 0; u < 3; u++){
            if(suspicion.selfDisproved === true){
                break;
            }
            else{
                for(var h = 0; h < playerlist_withCards[a].cards.length; h++){
                    if(accuseArray[u] === playerlist_withCards[a].cards[h]){
                        console.log("Accuser can disprove " + accuseArray[u]);
                        suspicion.selfDisproved = true;
                        break;
                    }
                    else{
                        suspicion.selfDisproved = false;
                    }
                }
            }
        }   
 
        a = a + 1;                              // add 1 to a to start checking next player
        while(suspicion.disproved === false){       
            // loop needs to stop once all players have been checked or if  
            // accusation is disproven 
            if(a > playerlist_withCards.length - 1){ 
                // if tracker variable a is higher than the number of players - 1, all players checked, exit loop
                console.log("all players checked");             
                break;
            }
            else{
                // check accusation against the next player's hand
                suspicion.disproved = checkAccusation(accusedCards, playerlist_withCards[a]); 
                a++;
            }
        }
        console.log(suspicion);    // let accuser know if they disproved the accusation and/or if anyone else did.
    
        // if the accuser can't disprove, and neither can the other players,
        // the accusation must be correct. 
        if((suspicion.selfDisproved === false && suspicion.disproved === false)){
            console.log("accusation not disproven by accuser or by other players.");
            return tryWin(accusedCards);
        }
        else{
            return errMsg();
        }
    };

    // the checkAccusation function compares the accusation array to the cards
    // in the next player's hand. If any of the accused items are in the player's hand,
    // the item is showed to the player making the accusation, and the item is removed from 
    // whichever accusable array it belongs to. 

    // current checking order: 1. characters, 2. weapons, 3. rooms. 
    const checkAccusation = (charCards, weaponCards, roomCards, accuseArr, player) => {    
        //var continueCheck = prompt("started checkAccusation function against " + player.name + ". proceed?  Y/N");
        if(player.cards.includes(accuseArr[0])){                            // check for characters first
            console.log(player.name + " can disprove "+ accuseArr[0]);
            charCards.splice(charCards.indexOf(accuseArr[0]),1);    // remove from suspectarray if disproved
            setCharCardArr(charCards); // update visible cards
            return true;
        }
        else if(player.cards.includes(accuseArr[1])){                       // check for weapons second
            console.log(player.name + " can disprove " + accuseArr[1]);
            weaponCards.splice(weaponCards.indexOf(accuseArr[1]),1);  // remove from suspectarray if disproved
            setWeaponCardArr(weaponCards); // update visible cards
            return true;
        }
        else if(player.cards.includes(accuseArr[2])){                       // check for rooms third
            console.log(player.name + " can disprove "+ accuseArr[2]);
            roomCards.splice(roomCards.indexOf(accuseArr[2]),1);      // remove from suspectarray if disproved
            setRoomCardArr(roomCards); // update visible cards
            return true;
        }
        else{
            console.log(player.name + " could not disprove");
            return false;
        }
    };
*/

    // returns the current time in milliseconds since program began running
    async function getCurrentMillis() {
        return performance.now()
    }

    async function setTotalTime() {
        timerToggle(false);
        let stopTime = await getCurrentMillis();
        console.log("--- setTotalTime() - async -> newTime: ", stopTime)
        let totalTime = Number(stopTime) - Number(startTime);
        return totalTime
    }

    async function continueOnTimeDiffSet() {
        let inputTimeDiff = await setTotalTime()
        console.log("inputTimeDiff (should = totalTime from setTotalTime): ", inputTimeDiff)
        if(inputTimeDiff){
            setTimeDiff(inputTimeDiff)
            return inputTimeDiff // want to pass this into the scoring function
        }
        else{
            return 0 
        }
    }






    // check final accusation against contents of confidential folder
    const finish = () => {
        let charCards = charCardArr;
        let weaponCards = weaponCardArr;
        let roomCards = roomCardArr;
        //console.log("accusedCards: ", accusedCards);
        if(accusedCards.accusedChar === culprit.who){
            //console.log("Matched the character")
            if(accusedCards.accusedWeapon === culprit.what){
                //console.log("Matched the weapon")
                if(accusedCards.accusedRoom === culprit.where){
                    //console.log("Matched the room");
                    console.log("Wait, did you just finish the game?!!");
                    console.log("\nSTOP THE CLOCK!\n\n");
                    // let setEndTime = new Promise(function(response, reject) { 
                    //     response(performance.now())
                    // })

                    continueOnTimeDiffSet().then(
                        function(value) {
                            console.log("--- inside function(value) {} of continueOnTimeDiffSet() --> value: ", value);
                            //timerToggle(false);
                            //setTimeDiff(value)
                            setGameOver(true)
                            openModal()
                            renderCulprit()
                            setGameScore(renderScore(value))

                            // renderCulprit()
                            // setGameScore(renderScore(value))

                        }
                    )


                    //player.win = player.win + 1;        // update the winning player's win status
                }
                // if accused room is not the culprit, but still visible on the left, remove it
                else {
                    //console.log("Did not match rooms");
                    //console.log("roomCards: ", roomCards);
                    //console.log("accusedRoom: ", accusedCards.accusedRoom);
                    const newRooms = roomCards.filter(card => card.name !== accusedCards.accusedRoom)
                    //console.log("newRooms: ", newRooms);
                        //console.log(accusedCards.accusedRoom, " -- DISPROVED");
                        //roomCards.splice(roomCards.indexOf(accusedCards.accusedRoom),1);    // remove from suspectarray if disproved
                    setRoomCardArr(newRooms); // update visible cards
                }
            }
            // if accused weapon is not the culprit, but still visible on the left, remove it
            else { 
                //console.log("Did not match weapons");
                //console.log("weaponCards: ", weaponCards);
                //console.log("accusedWeapon: ", accusedCards.accusedWeapon);
                const newWeapons = weaponCards.filter(card => card.name !== accusedCards.accusedWeapon)
                //console.log("newWeapons: ", newWeapons);
                    //console.log(accusedCards.accusedRoom, " -- DISPROVED");
                    //roomCards.splice(roomCards.indexOf(accusedCards.accusedRoom),1);    // remove from suspectarray if disproved
                setWeaponCardArr(newWeapons); // update visible cards
            }

        }
        // if accused character is not the culprit, but still visible on the left, remove it
        else {
            //console.log("Did not match characters");
            //console.log("characterCards: ", charCards);
            //console.log("accusedChar: ", accusedCards.accusedChar);
            const newChars = charCards.filter(card => card.name !== accusedCards.accusedChar)
            //console.log("newChars: ", newChars);
                //console.log(accusedCards.accusedRoom, " -- DISPROVED");
                //roomCards.splice(roomCards.indexOf(accusedCards.accusedRoom),1);    // remove from suspectarray if disproved
            setCharCardArr(newChars); // update visible cards
        }
    };

    // ------------------------------------------------------------------------- 


    //const isNewBestScore



    // ------------------------- Play Game Section -----------------------------
/*
    const play = (gameObj, playerList, gameOver, accusationResult ) => {
        var t0 = performance.now();
        while(gameOver === false){
            console.log("Make a new accusation...");
            console.log("Accuser's hand: " + playerList[0].cards); // show accuser their hand to help with accusing
            accusationResult = makeAccusation(playerList); // returns correct accuseArray or [0,0,0].
        }
    
        finish(accusationResult, playerList[0]);
        var t1 = performance.now();         // records how many milliseconds passed after t0 was defined. 
        const tTotalSeconds = (t1 - t0) / 1000;   // convert to seconds
    
        gameObj.characters = charCardArr;
        gameObj.weapons = weaponCardArr;
        gameObj.rooms = roomCardArr;
        gameObj.players = playerList;
    
        gameObj.accusables.push(accusablePeople);
        gameObj.accusables.push(accusableWeapons);
        gameObj.accusables.push(accusableRooms);
    
        gameObj.completionTime = String(tTotalSeconds.toFixed(2)) + " seconds";    // add completionTime to gameObj data
        console.log("Game Over. " + playerList[0].name + " solved the case in " + (tTotalSeconds/60).toFixed(2) + " minutes ("+ tTotalSeconds.toFixed(2) +" seconds)!");
        const winnerScore = getScore(tTotalSeconds);
        gameObj.score = String(winnerScore) + " points";                           // add score to gameObj data
        //gameObj; // should display gameObj info at the end of each gameObj
    
        console.log("Last Game Stats:");
        console.log(gameObj); // will definitely display gameObj info 
    };

*/
    // ---------------- Timer -----------------
    // some simple timer start and stop functions I found


    const pad = (val) => {
        return val > 9 ? val : "0" + val;
    }

    const timerToggle = (boolean) => {
        let timer = gameTimer;
        if(boolean){ 
            // if parameter is passed in that notifies the timer to start, start the timer
            var sec = 0;
            timer = setInterval(function () {
                document.getElementById("seconds").innerHTML = pad(++sec % 60);
                document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
            }, 1000);
            setGameTimer(timer);
            //console.log("timer: ", timer)
        }
        else {
            //console.log("timer: ", timer)
            clearInterval(gameTimer);
            
        }
    }

    // ----------------------------------------

    // -------------------------------------------------------------------------

    const renderCulprit = () => {

        const contentTarget = document.querySelector(".confidential");
        contentTarget.innerHTML = `
            <section className="envelope" >
                <h3>Culprit</h3>
                <p>${`Who: ${culprit.who}`}</p>
                <p>${`What: ${culprit.what}`}</p>
                <p>${`Where: ${culprit.where}`}</p>
            </section
        `
            
    }

    // const renderCulpritDebug = () => {
    //    return <section className="envelopeDebug" >
    //             <p>${`Who: ${culprit.who}`}</p>
    //             <p>${`What: ${culprit.what}`}</p>
    //             <p>${`Where: ${culprit.where}`}</p>
    //         </section>
       
    // }

    const renderScore = (inputTime) => {
        const contentTarget = document.querySelector(".scoreArea");
        const myScore = getScore(charCardArr, weaponCardArr, roomCardArr, inputTime, numPlayers);
        let accusableAll = charCardArr.concat(weaponCardArr, roomCardArr);
        let timeInSec = Number(inputTime) / 1000;
        console.log(myScore)
        setGame({
            userId: activeUserId,
            characters: charCardArr,
            weapons: weaponCardArr,
            rooms: roomCardArr,
            players: numPlayers,
            completionTime: Number(timeInSec).toFixed(2),
            accusables: accusableAll.length,
            score: myScore
        })
        contentTarget.innerHTML = `
            <section className="myScore" >
                <p><strong>Players:</strong> ${numPlayers}</p>
                <p><strong>Completion Time:</strong> ${(Number(inputTime)/1000).toFixed(2)} seconds</p>
                <p><strong>Characters remaining:</strong> ${charCardArr.length}</p>
                <p><strong>Weapons remaining:</strong> ${weaponCardArr.length}</p>
                <p><strong>Rooms remaining:</strong> ${roomCardArr.length}</p>
                <p><strong>Score:</strong> ${myScore}\n</p>
            </section
            `
        return myScore
        
    }

    

    const createCharDropdown = (cardArray) => {
        //console.log("cardArray - createCharDropdown: ", cardArray);
        // const characters = cardArray.filter(card => {
        //     return card.type === "character"
        // })
        //console.log("characters: ", characters);
        //setAllCharacters(characters)
        return (
            <select id="characterSelect" name="accusedChar" className="cardSelector-dropdown" onChange={handleControlledAccuseSelectChange}>
                <option value="0">Character</option>
                    {
                        cardArray.map(card => {
                            return  <option key={card.id} value={card.name}>{card.name}</option>
                        })
                    } 
            </select>

        )
    }

    const createWeaponDropdown = (cardArray) => {
        // const weapons = cardArray.filter(card => {
        //     return card.type === "weapon"
        // })
        //console.log("cardArray - createWeaponDropdown: ", cardArray);
        //setAllWeapons(weapons)
        return (
            <select id="weaponSelect" name="accusedWeapon" className="cardSelector-dropdown" onChange={handleControlledAccuseSelectChange}>
                <option value="0">Weapon</option>
                    {
                        cardArray.map(card => {
                            return  <option key={card.id} value={card.name}>{card.name}</option>
                        })
                    } 
            </select>

        )
    }

    const createRoomDropdown = (cardArray) => {
        // const rooms = cardArray.filter(card => {
        //     return card.type === "room"
        // })
        //console.log("cardArray - createRoomDropdown: ", cardArray);
        //setAllRooms(rooms)
        return (

            <select id="roomSelect" name="accusedRoom" className="cardSelector-dropdown" onChange={handleControlledAccuseSelectChange}>
                <option value="0">Room</option>
                    {
                        cardArray.map(card => {
                            return  <option key={card.id} value={card.name}>{card.name}</option>
                        })
                    } 
            </select>

        )
    }

    const generateRandomCulprit = () => {
    let person = Math.floor((Math.random() * (charCardArr.length)) + 0);
        let weapon = Math.floor((Math.random() * (weaponCardArr.length)) + 0);
        let room = Math.floor((Math.random() * (roomCardArr.length)) + 0);
        console.log("person: " + person + " weapon: " + weapon + " room: " + room)
        setCulprit({
            who: charCardArr[person].name,         // return random name from characters array
            what: weaponCardArr[weapon].name,    // return random weapon from weapons array
            where: roomCardArr[room].name        // return random room from rooms array
            
        })      
    }

    // post game modal 

    const openModal = () => {
        setIsOpen(true);
    }
    
    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }
    
    const closeModal = () => {
        setIsOpen(false);
        history.push("/"); // take the player back to the home page
    }

    const PostGameModal = (HTMLTarget) => {
        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
        };
        
        Modal.setAppElement(HTMLTarget)
    
        return (

            <div>
                <Modal
                    id="open-modal"
                    className="postGameModal"
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    //style={customStyles}
                    contentLabel="Example Modal"
                >
                    <button onClick={closeModal} title="Close" className="postGameModal-close">Close</button>
                    <div className="postGameModal-window">
                        {/* <button onClick={closeModal} title="Close" className="postGameModal-close">Close</button> */}
                        <h2 ref={_subtitle => (subtitle = _subtitle)}>Case Solved!</h2>
                        {/* <div>I am a modal</div> */}
                    
                        <div className="postGameModal-gameResults">
                            <div className="confidential">
                            </div>
                            <div className="scoreArea">
                            </div>
                        </div>
                    </div>

                    
                    {/* <button className="postGameModal-close" onClick={closeModal}>close</button> */}
                </Modal>
            </div>
        );
    }

    return (
        <>
            <div className="modalGoesHere">
                {PostGameModal(document.querySelector(".modalGoesHere"))}
            </div>


            <div className="gameboard-top">
                <h1 className="gameboard-title">Classic Game</h1>
                <div className="timerBox">
                    <span id="minutes"></span>:<span id="seconds"></span>
                </div>
            </div>

            <section className="gameboard">
                {/* <div className="gameboard-gameName">{customGameId ? `Name: ${currentGame.gameName}` : <></>}</div> */}
                {/* <div className="gameboard-gameId">{customGameId ? `Creator Id: ${currentGame.user}` : <></>}</div> */}
                <div className="gameboard-playArea">
                    <section className="gameboard-cardList">
                        <div className="cardList charCardList">
                            <h3 className="charList-title">Characters</h3>
                            {charCardArr.map(card => {
                                return <CardHTML key={card.id} cardObj={card} />
                            })}
                        </div>
                        <div className="cardList weaponCardList">
                            <h3 className="weaponList-title">Weapons</h3>
                            {weaponCardArr.map(card => {
                                return <CardHTML key={card.id} cardObj={card} />
                            })}
                        </div>
                        <div className="cardList roomCardList">
                            <h3 className="roomList-title">Rooms</h3>
                            {roomCardArr.map(card => {
                                return <CardHTML key={card.id} cardObj={card} />
                            })}
                        </div>
                    </section>
                    <section className="gameboard-accusationBox">
                            <div className="accusationBox">
                                {
                                    (roomCardArr.length > 0 && weaponCardArr.length > 0 && charCardArr.length > 0) ? 
                                    <div className="dropdowns"> 
                                        {createCharDropdown(allCharacters)}
                                        {createWeaponDropdown(allWeapons)}
                                        {createRoomDropdown(allRooms)}
                                    </div> : <></>
                                }
                            </div>
                            <div className="accusationButton">
                                <button type="button" id="accuse-btn" onClick={finish}>Accuse</button>
                            </div>
                    </section>
                </div>
                {/* <div className="confidentialDebug">
                    {renderCulpritDebug()}
                </div> */}
            </section>
        </>
    )
}