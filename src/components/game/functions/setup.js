



import React from "react"



// for however many players are playing, a new player object is created 
// and is added to the total list of players:
const createPlayers = (numPlayers) => {
    let playerList = []; 
    var temp = "Player";
    for(var i= 0; i < numPlayers; i++){
        let player = {
            name: temp + String(i+1),   // generate general names for all players (Player1, Player2, etc.)
            cards: [],                  // keep track of cards dealt to each player
            win: 0                      // if a player accuses correctly, their win tag becomes 1 and the game ends.
        };
        playerList.push(player);        // add new player to list of players
    }
    return playerList
};

// Deal all cards that are not in confidential envelope to all players.
const deal = (numPlayers, cardsInPlay, playerList) => {
    var cardsPerPlayer = Math.floor(cardsInPlay.length/numPlayers); // 18 is the total number of cards (21) minus the three for the culprit
    var indexOfCard = 0;
    for(var i = 0; i < numPlayers; i++){
        for(var j = 0; j < cardsPerPlayer; j++){
            // grab a random card from the deck
            var card = cardsInPlay[Math.floor(Math.random() * (cardsInPlay.length - 0)) + 0]; // just as good as shuffling the deck
            playerList[i].cards.push(card);
            indexOfCard = cardsInPlay.indexOf(card);
            cardsInPlay.splice(indexOfCard, 1);
        }
    } // all players have an even number of cards to play with, but there could be more cards to be dealt.
    i = 0;  // ------- I don't like this either
    // deal the remaining cards until no cards left to deal
    while(cardsInPlay.length > 0){
        card = cardsInPlay[Math.floor(Math.random() * (cardsInPlay.length - 0)) + 0];
        playerList[i].cards.push(card); 
        indexOfCard = cardsInPlay.indexOf(card);
        cardsInPlay.splice(indexOfCard, 1);
        i = i + 1;
    }
    
    return playerList //return the player list with each palyer now having cards
};


// game setup function. Sets up all data for the game to begin. 
export const setup = (charCards, weaponCards, roomCards, culprit, numPlayers) => {
    let allCharacters = charCards; // make copies of the input arrays so they aren't edited directly
    let allWeapons = weaponCards;
    let allRooms = roomCards;
    let cardsInPlay = []; // this list of cards will be dealt to the players

    console.log("\nCreate Players\n");
    const playerList = createPlayers(numPlayers);

    console.log("\nCreate Suspect Arrays\n");

    allCharacters.splice(allCharacters.indexOf(culprit.who), 1); 
    // remove the character who is the culprit from dealable cards
    for(var i = 0; i < allCharacters.length; i++){
        cardsInPlay.push(allCharacters[i]);}

    allWeapons.splice(allWeapons.indexOf(culprit.what), 1);
    // remove the weapon the culprit used from dealable cards
    for(var j = 0; j < allWeapons.length; j++){
        cardsInPlay.push(allWeapons[j]);}

    allRooms.splice(allRooms.indexOf(culprit.where), 1);
    // remove the room the culprit was in from dealable cards
    for(var k = 0; k < allRooms.length; k++){
        cardsInPlay.push(allRooms[k]);}
    

    console.log("\nDealing\n");
    const playerListWithCards = deal(numPlayers, cardsInPlay, playerList);
    console.log("\n");

    return playerListWithCards
};


