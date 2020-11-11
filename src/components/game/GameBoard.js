// This file describes the functionality and the appearance of the playable game area
// This page is accessed by either clicking the "New Game" button for the classic game mode
// or (TO DO) by creating a new custom game and then clicking "save settings" button. 

import React, { useContext, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import { CardContext } from "../card/CardProvider.js";
import { CardHTML } from "../card/Card.js";
import { ClassicGameResultsContext } from "./ClassicGameProvider.js";
import { getScore } from "./functions/score.js";
import Modal from 'react-modal';
import "./Game.css";


export const GameBoard = (props) => {

    const { cards, getCardsByGameId, getCardsByGameIdAndType } = useContext(CardContext)
    const { getBestResultsByUserId, updateBestResults, addBestResults} = useContext(ClassicGameResultsContext)

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


    // object which will store the three cards that make up an accusation
    const [accusedCards, setAccusedCards] = useState({
        accusedChar: "",
        accusedWeapon: "",
        accusedRoom: ""
    });

    // object which will store the three cards of information about the culprit
    const [culprit, setCulprit] = useState({})

    // Boolean to be watched by the end-game useEffect
    const [gameOver, setGameOver] = useState(false)

    const [numPlayers, setNumPlayers] = useState(0) // set via a prompt in the 2nd useEffect

    const [playerList, setPlayerList] = useState([]) // will hold each player object and each player's respective hand

    // initial timer state
    const [gameTimer, setGameTimer] = useState(0)


    const [gameScore, setGameScore] = useState(0)

    const [modalIsOpen, setIsOpen] = useState(false)

    let subtitle;

    const [newHighScoreMsg, setNewHighScoreMsg] = useState("")

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

    // ----------------------- useEffects -----------------------------

    // ---- initial grabbing of game cards useEffect ----
    useEffect(() => {
        if(flag === false){ 
            // this useEffect is only executed once
            //console.log("flag: ", flag)
            getCardsByGameId(0)
            // User is going to play a classic game, 
            // create new object to hold the game results
            // fetch the classic game cards

            // These will hold the cards to be displayed and narrowed down during a game
            getCardsByGameIdAndType(0, "character") // sets the 'cards' variable with cards with gameId = 0
            .then(setCharCardArr)

            getCardsByGameIdAndType(0, "weapon")
            .then(setWeaponCardArr)

            getCardsByGameIdAndType(0, "room")
            .then(setRoomCardArr)

            setFlag(true)
        }   
    }, [])

    // ---- number of players prompt useEffect ----
    useEffect(() => {
        var numberOfPlayers = prompt("How many people are playing? (2 - 6)", "2");
        //console.log("number of players? : ", numberOfPlayers);
        setNumPlayers(numberOfPlayers);
        setStartTime(performance.now())
    }, [])

    // ---- timer initiation useEffect ----
    useEffect(() => {
        if(numPlayers > 0){
            //console.log("numPlayers: ", numPlayers)
            timerToggle(true)
        }
    }, [numPlayers])


    //  ---- card duplication useEffect ----
    useEffect(() => {
        if(flag === true){
            // once the flag status changes, this useEffect runs, also only once. 
            //console.log("flag: ", flag)

            // These will hold the card options which remain unchanged while accusing cards
            getCardsByGameIdAndType(0, "character") 
            .then(setAllCharacters)

            getCardsByGameIdAndType(0, "weapon")
            .then(setAllWeapons)

            getCardsByGameIdAndType(0, "room")
            .then(setAllRooms)
        }
    }, [flag])


    // ---- culprit creation useEffect ----
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


    // ---- end-game useEffect ----
    // when game is finished, check results and upload new high score if necessary
    useEffect(() => {
        if(gameOver === true) {
            if(game.score !== null){
                // game is over, check if active user's current bestGameResult score is higher or lower than current game score

                getBestResultsByUserId(activeUserId)
                .then(result => {
                    compareGameResults(result, game)
                })
            }
        }
    }, [game, gameOver])

    // ----------------------------------------------------------------------


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
        //console.log("existingResults: ", existingResults)
        //console.log("currentResults: ", currentResults)
        // existingResults is an object inside a one-element array, access obj with [0]
        // both parameters are objects, so access score with .score
    
        // does the existing game exist?
        if(existingResults[0]){
            // then the existing results must include a score to compare
            //console.log("existingResults score: ", Number(existingResults[0].score))
            //console.log("currentResults score: ", currentResults.score)

            if(currentResults.score >= Number(existingResults[0].score)){
                // if the current score is as high or higher than the existing score, update the user's best Classic game results
                //console.log("New high score: ", currentResults.score)
                setNewHighScoreMsg("New High Score: " + currentResults.score)
                updateBestResults(existingResults[0].id, currentResults)
            }
            else{
                //console.log("High score: ", Number(existingResults[0].score))
                setNewHighScoreMsg("High Score: " + Number(existingResults[0].score)) 
            }
        }
        else{
            // existing score does not exist, so just add currentResults to database
            //console.log("User's first game results!")
            setNewHighScoreMsg("New High Score: " + currentResults.score)
            addBestResults(currentResults)
            
        }
    }


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
                    const newRooms = roomCards.filter(card => card.name !== accusedCards.accusedRoom)
                    setRoomCardArr(newRooms); // update visible cards
                }
            }
            // if accused weapon is not the culprit, but still visible on the left, remove it
            else { 
                const newWeapons = weaponCards.filter(card => card.name !== accusedCards.accusedWeapon)
                setWeaponCardArr(newWeapons); // update visible cards
            }
        }
        // if accused character is not the culprit, but still visible on the left, remove it
        else {
            const newChars = charCards.filter(card => card.name !== accusedCards.accusedChar)
            setCharCardArr(newChars); // update visible cards
        }
    };

    // ------------------------------------------------------------------------- 



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
            <h3>Stats</h3>
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
                        <div className="newHighScore">
                            <h1>{newHighScoreMsg}</h1>
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
            </section>
        </>
    )
}