// Ben Davis -- lonely Planet
// 6-11-2019
// JavaScript (FrontEndMasters) --- So what if accusable isn't a word...

// The following code simulates a version of the popular board game Clue. 
/*
The game of Clue is played by two to six players attempting to individually figure out which one of the 
game's characters committed a murder with a particular weapon in a particular room before anyone else.

In this version of Clue, the only sentient player is the user. Games consist of one player 
constantly accusing trying to narrow down the culprit and can last as short as a minute (or less).
Any other players specified cannot play against the user... yet.

This program allows the user to take turns accusing certain characters in certain rooms with certain weapons.
    Like the game, once an accusation is made, the program checks through each player's hand
    to see if they have a card they can use to disprove the user's accusation. 
The user will have the hand dealt to Player 1, so the program will check player 2 through n's hands.
If a player has at least one card contained in the user's accusation, the player shows the user one card. 
    (The player will have preference to show people first, then weapons, then rooms)...
If a player does not have at least one card contained in the user's accusation, the next player's hand is checked.
If the last player is reached but none of the cards in the user's accusation are found in other players' hands,
    AND if the same cards are also not in the user's hand, then the program checks the confidential envelope to reveal the culprit. 
If the accusation matches the confidential envelope's contents, the accuser (the user (player 1)) wins and the game ends.

--------- READ THIS TO UNDERSTAND HOW TO INTERPRET GAME OUTPUTS ----------
A browser javascript console must be used to execute this game of Clue.

1. Highlight and copy all code starting at line 97 (var name;) until the end.
    1a. (If you want to be safe, you can highlight copy everything in this file)
        (comments in dark green like these instructions are ignored when the program executes.)
2. Open an internet browser (google chrome preferred)
3. Click on the "View" tab
4. Navigate to "Developer"
5. Click on "Javascript Console"
6. Paste the copied code into the console editor window and press enter

Setting Up:
        After entering an allowable number of players, the console will display the following:
        "Create Players"        -- signifying the creation of all player objects 
        "Create Suspect Arrays" -- the dealable cards have been determined and the culprit has been decided
        "Dealing"               -- dealable cards are dealt out to all players as evenly as possible
        
        The three items above represent the game setup function, which is timed and the
        total time spent setting up the game is displayed next in milliseconds.

Accusing:
        After entering 'y' to the "ready to start?" prompt, the program shows: 
        - (IMPORTANT) The contents of the user's hand (the accuser)
        - the character, weapon, and room arrays to accuse from

        After an accusation is made, the following will appear:
        - a recap of the accusation
        - if the accuser can disprove anything (will only appear if true)
        - Ascending check of the other players until someone can disprove anything 
            - if they can, the disproved item is shown
            or until all players have been checked. 
                - "all players checked" will appear
        - if the accuser disproved anything and if the other players disproved anything
            - ('selfDisproved' and 'disproved')
        - if either 'disproved's are true, the message "Accusation Disproved. Go Again" appears.
        (repeat until accusation cannot be disproven)

        As items are disproved by other players, they are removed from their accusable arrays
        to help the accuser narrow down the culprit.

        When the user has accused correctly and the accusation cannot be disproved,
        "Game Over. Player1 has solved the case in x minutes (x*60 seconds)!" is displayed
Scoring:
        The user's score is then calculated first from counting the items still in their 
        accusable arrays. Then a multiplier depending on how quickly the 
        case was solved is applied. Finally, a bonus is added depending on how many players
        the user played against. See the scoring scale below for more details.

    Scoring scale (applied in the same order when scoring): ---------------- 
    -   +10 points for every item that did not have to be disproved. 
            (if a character, weapon, or room is still accusable by the end of the game, + 10 points/item)

    -   3 * points if completion time < 1 minute, 30 seconds ("three stars multiplier")
    -   2 * points if completion time < 2 minutes, 30 seconds ("two stars multiplier")
    -   1.5 * points if completion time < 3 minutes, 30 seconds ("one star multiplier")
    -   1 * points if completion time >= 3 minutes, 30 seconds ("no star multiplier") - aka no multiplier
    
    -   -10% when playing with just two players (easy)
    -   +0% when playing with three players (normal)
    -   +5% when playing with four players (advanced) 
    -   +10% when playing with five players (difficult)
    -   +20% when playing with six players (very difficult)   

    NOTES: 
    - all accusible items have a single-word name. Enter the names available in the 'Accusable: ...' display
        - ex: accuse 'white' instead of 'mrs. white'
        - ex: accuse 'pipe' instead of 'lead pipe'
        - ex: accuse 'dining' instead of 'dining room' (same for 'billiards')
   
*/

var name;                   // used to choose a random character for confidential envelope
var weapon;                 // used to choose a random weapon for confidential envelope
var room;                   // used to choose a random room for confidential envelope

var suspectPeople = [];     // used to deal the characters  \
var suspectWeapons = [];    // used to deal the weapons      } all are missing their item related to the culprit
var suspectRooms = [];      // used to deal the rooms       /

var accusablePeople = [];   // all characters are accusable. \
var accusableWeapons = [];  // all Weapons are accusable.     } If item is disproved, it is removed from array
var accusableRooms = [];    // all Rooms are accusable.      /

clear();

var numPlayers = prompt("How many people are playing? (2 - 6)", "2");   // default to two players if user just presses enters
                                                                        // 4-5 Players are reccomended. 
var cardsInPlay = [];       // all cards that can be dealt (every card in all suspect arrays)
var numCardsInPlay;         // cardsInPlay.length;
var gameOver = false;       // set to true when the accusation cannot be disproven by the accuser or other players. 
var accusationResult = [];  // holds the accusation 

var setupTotal = 0;         // calculates how much time was required to setup the game via setup();.
var tTotalSeconds = 0;      // calculates how much time the game takes to complete. 

var winnerScore = 0;        // used to store the score calculations from getScore().
var playAgain;              // prompt between games asking if user wants to play again. 
var editMode;               // prompt between games asking if user wants to change the number and name of characters, weapons, and/or rooms.
var playerList = [];        // contains list of all players {name, list of cards in hand}


// all game data is stored in the 'game' object. 
// TODO: Game information will be sent to an online scoreboard that is accessible by a link 
//       provided in addition to the choice for the user to upload their score or not. 
//       Uploadable information is stored in 'upload' object.
var game = {
    'characters': null,
    'weapons': null,
    'rooms': null,
    'players': null,
    'setupTime': null,
    'completionTime': null,
    'accusables': [],
    'score': null
};

/*const upload = {
    'a': game.culprit,
    'b': game.players,
    'c': game.accusables,
    'd': game.completionTime,
    'e': game.score
};*/
while((numPlayers > 6) || (numPlayers < 2)){
	if(numPlayers > 6){
		numPlayers = prompt("Too many players! Please select a number of players between 2 and 6");
	} 
	else if(numPlayers < 2){
		numPlayers = prompt("Too few players! Please select a number of players between 2 and 6");
	} 
}

var allCharacters = ["white", "mustard", "peacock", "plum", "scarlet", "green"];
var allWeapons = ["candlestick", "pipe", "gun", "rope", "knife", "wrench"];
var allRooms = ["greathall", "billiards", "dining", "kitchen", "conservatory", "study", "library", "lounge", "ballroom"];

/*
const gameNames = {
    'prefix': ['Mrs. ', 'Colonel ', 'Ms. ', 'Professor ', 'Miss ', 'Mr. '],
    'suffix': ['White', 'Mustard', 'Peacock', 'Plum', 'Scarlet', 'Green']
}
console.log(gameNames);

for(var r = 0; r < gameNames.prefix.length; r++){
    console.log(gameNames.prefix[r] + gameNames.suffix[r]);
}
*/


// randomly generate the culprit's info (who, what, and where):
name = Math.floor(Math.random() * (allCharacters.length - 0)) + 0;
weapon = Math.floor(Math.random() * (allWeapons.length - 0)) + 0;
room = Math.floor(Math.random() * (allRooms.length - 0)) + 0;

var confidential = {};      // object which will store the three cards of information about the culprit
confidential.who = allCharacters[name];    // return random name from characters array
confidential.what = allWeapons[weapon];    // return random weapon from weapons array 
confidential.where = allRooms[room];       // return random room from rooms array
// ^ this is what the user will try to determine by accusing. 
/*
var confidentialUser = {};  // user-determined culprit for quick debugging
confidentialUser.who = prompt("Choose a Character's last name: \nMrs. White\nColonel Mustard\nMs. Peacock\nProfessor Plum\nMiss Scarlet\nMr. Green").toLowerCase();
confidentialUser.what = prompt("Choose a Weapon: \ncandlestick \npipe \ngun \nrope \nwrench \nknife").toLowerCase();
confidentialUser.where = prompt("Choose a Room: \nGreatHall \nBilliards \nParlor \nKitchen \nConservatory \nStudy \nLibrary \nOffice").toLowerCase();
*/

// make the arrays which will change according to whether an accused item is disproved or not
// Represent characters, weapons, and rooms that can be accused 
// only ones that have not been disproved yet by another player are kept in these arrays
for(var o = 0; o < allCharacters.length; o++){
    accusablePeople.push(allCharacters[o]);
}
for(var p = 0; p < allWeapons.length; p++){
    accusableWeapons.push(allWeapons[p]);
}
for(var q = 0; q < allRooms.length; q++){
    accusableRooms.push(allRooms[q]);
}

// for however many players are playing, a new player object is created 
// and is added to the total list of players:
function CreatePlayers(numPlayers){ 
    var temp = "Player";
    for(var i= 0; i < numPlayers; i++){
        player = {
            name: temp + String(i+1),   // generate general names for all players (Player1, Player2, etc.)
            cards: [],                  // keep track of cards dealt to each player
            win: 0                      // if a player accuses correctly, their win tag becomes 1 and the game ends.
        };
        playerList.push(player);        // add new player to list of players
    }
};

function GetPlayerCards(player){        // return the cards in a playerList[i]'s hand in an array
    var playerCards = [];
    //console.log("Player " + player.name + " has: ");
    for(var k = 0; k < player.cards.length; k++){
        //console.log(player.cards[k]);
        playerCards.push(player.cards[k]);
    }
    return playerCards;                 // returns an array of the cards belonging to a player
};

// the CheckAllCards function is used mainly for debugging purposes
// to make sure all cards were dealt correctly. 
function CheckAllCards(players){        // checks the cards in all players' hands in order of ascending players
    for(var i= 0; i < players.length; i++){
        console.log("Player " + players[i].name + " has: ");
        for(var k = 0; k < players[i].cards.length; k++){
            console.log(players[i].cards[k]);
        }
        console.log("onto next player\n");
    }
};

// Deal all cards that are not in confidential envelope to all players.
function deal(numPlayers, cardsInPlay){
    var cardsPerPlayer = Math.floor(numCardsInPlay/numPlayers); // 17 is the total number of cards (20) minus the three for the culprit = 17
    var indexOfCard = 0;
    for(var i = 0; i < numPlayers; i++){
        for(var j = 0; j < cardsPerPlayer; j++){
            var card = cardsInPlay[Math.floor(Math.random() * (cardsInPlay.length - 0)) + 0]; // just as good as shuffling the deck
            playerList[i].cards.push(card);
            indexOfCard = cardsInPlay.indexOf(card);
            cardsInPlay.splice(indexOfCard, 1);
        }
    } // all players have an even number of cards to play with, but there are more cards to be dealt.
    i = 0;  // ------- I don't like this either
    // deal the remaining cards until no cards left to deal
    while(cardsInPlay.length > 0){
        card = cardsInPlay[Math.floor(Math.random() * (cardsInPlay.length - 0)) + 0];
        playerList[i].cards.push(card); 
        indexOfCard = cardsInPlay.indexOf(card);
        cardsInPlay.splice(indexOfCard, 1);
        i = i + 1;
    }
};

// game setup function. Sets up all data for the game to begin. 
const setup = () => {
    var setupTime0 = performance.now();  // time how long the game takes to set itself up for fun
    console.log("\nCreate Players\n");
    CreatePlayers(numPlayers);
    console.log("\nCreate Suspect Arrays\n");
    
    allCharacters.splice(allCharacters.indexOf(confidential.who), 1);
    for(var i = 0; i < allCharacters.length; i++){
        suspectPeople.push(allCharacters[i]);}
    allCharacters.push(confidential.who); // put the killer's name back in list of all character names

    allWeapons.splice(allWeapons.indexOf(confidential.what), 1);
    for(var j = 0; j < allWeapons.length; j++){
        suspectWeapons.push(allWeapons[j]);}
    allWeapons.push(confidential.what); // put the killer's weapon back in list of all weapons

    allRooms.splice(allRooms.indexOf(confidential.where), 1);
    for(var k = 0; k < allRooms.length; k++){
        suspectRooms.push(allRooms[k]);}
    allRooms.push(confidential.where); // put the killer's room back in list of all rooms
   
    cardsInPlay = suspectPeople.concat(suspectRooms, suspectWeapons);   // this list of cards will be dealt to the players
    numCardsInPlay = cardsInPlay.length;

    console.log("\nDealing\n");
    deal(numPlayers, cardsInPlay);
    console.log("\n");

    var setupTime1 = performance.now();
    setupTotal = setupTime1 - setupTime0;
    console.log("game setup in "+ setupTotal.toFixed(2)+ " milliseconds.");
    game.setupTime = String(setupTotal.toFixed(2)) + " milliseconds";
};

setup();

// tryWin sets gameOver so the accusing whileloop can halt. 
// tryWin also returns the final, non-disproved accusation 
const tryWin = (accuseArr) => {
    gameOver = true;
    return accuseArr;
};

// errMsg returns an array of three zeros after checking all player's hands 
// and the accusation is disproven
const errMsg = () => {             
    console.log("Accusation Disproved. Go Again.");
    gameOver = false;
    return [0,0,0];
};

function makeAccusation(playerlist){ 
    /* prompt the current turn's player to accuse a 
        - character from accusablePeople array
        - weapon from accusableWeapons array
        - room from accusableRooms array
    */ 

    // Local scope variables. 
    var guilty = {
        selfDisproved: false,       // if cards in the accuser's hand can disproce accusation, set to true
        disproved: false            // if cards in another player's hand can disprove accusation, set to true 
    };
    // a tracks the number player which is currently being checked to potentially disprove the accusation
    var a = 0;
    // display all accusable arrays and their contents at the beginning of each new accusation:
    console.log("Accusable: \n" + accusablePeople + "\n" + accusableWeapons + "\n" + accusableRooms);
    var accuse = prompt("Accuse a character, weapon, and room separated by spaces: ");
    var accuseArray = accuse.split(' ');

    // handle any incorrect input from the user by re-prompting...
    while((!(allCharacters.includes(accuseArray[0])))||(!(allWeapons.includes(accuseArray[1])))||(!(allRooms.includes(accuseArray[2])))){
        accuse = prompt("invalid expressions.\nAccuse a character, weapon, and room separated by spaces.\nSee list of accusable items in console.");
        accuseArray = accuse.split(' ');
    }
    if((accuseArray[2] === "billiards")||(accuseArray[2] === "dining")){
        console.log(playerlist[a].name + " accuses "+ accuseArray[0]+" with the "+accuseArray[1]+" in the "+accuseArray[2]+" room!");
    }
    else{
        console.log(playerlist[a].name + " accuses "+ accuseArray[0]+" with the "+accuseArray[1]+" in the "+accuseArray[2]+"!");
    }
    // Check against the accuser's own cards first. 
    // If any of the accused items are in the accuser's hand, guilty.selfDisproved is set to true.
    // However, the item disproved is not removed from its accusable array.
    // This resembles the ability to accuse anything in your hand at any time to find out
    // the specific cards of other players. 
    for(var u = 0; u < 3; u++){
        if(guilty.selfDisproved == true){
            break;
        }
        else{
            for(var h = 0; h < playerlist[a].cards.length; h++){
                if(accuseArray[u] === playerlist[a].cards[h]){
                    console.log("Accuser can disprove " + accuseArray[u]);
                    guilty.selfDisproved = true;
                    break;
                }
                else{
                    guilty.selfDisproved = false;
                }
            }
        }
    }   
    //var continue1 = prompt("continue to guilty.disproved == false while loop?  Y/N");   
    a = a + 1;                              // add 1 to a to start checking next player
    while(guilty.disproved == false){       
        // loop needs to stop once all players have been checked or if  
        // accusation is disproven 
        if(a > numPlayers-1){ 
            // if tracker variable a is higher than the number of players - 1, all players checked, exit loop
            console.log("all players checked");             
            break;
        }
        else{
            // check accusation against the next player's hand
            guilty.disproved = checkAccusation(accuseArray, playerlist[a]); 
            a++;
        }
    }
    console.log(guilty);    // let accuser know if they disproved the accusation and/or if anyone else did.

    // if the accuser can't disprove, and neither can the other players,
    // the accusation must be correct. 
    if((guilty.selfDisproved == false && guilty.disproved == false)){
        console.log("accusation not disproven by accuser or by other players.");
        return tryWin(accuseArray);
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
function checkAccusation(accuseArr, player){    
    //var continueCheck = prompt("started checkAccusation function against " + player.name + ". proceed?  Y/N");
    if(player.cards.includes(accuseArr[0])){                            // check for characters first
        console.log(player.name + " can disprove "+ accuseArr[0]);
        accusablePeople.splice(accusablePeople.indexOf(accuseArr[0]),1);    // remove from suspectarray if disproved
        return true;
    }
    else if(player.cards.includes(accuseArr[1])){                       // check for weapons second
        console.log(player.name + " can disprove " + accuseArr[1]);
        accusableWeapons.splice(accusableWeapons.indexOf(accuseArr[1]),1);  // remove from suspectarray if disproved
        return true;
    }
    else if(player.cards.includes(accuseArr[2])){                       // check for rooms third
        console.log(player.name + " can disprove "+ accuseArr[2]);
        accusableRooms.splice(accusableRooms.indexOf(accuseArr[2]),1);      // remove from suspectarray if disproved
        return true;
    }
    else{
        console.log(player.name + " could not disprove");
        return false;
    }
};
// possible improvements to make checkAccusation() more efficient -- 
/*
1. check for information in the largest accusable array first 
(would probably start with rooms since that is the largest accusable array to start)
    - if multiple arrays are the same length, check in predefined order (person -> weapon -> room)
    - all arrays would decrease in size more uniformly 

2. check a random accusable array first (1/3), remove availability after
    - check a second random one (1/2), remove availability after
    - check whichever array still remains available 
        - availability might require accusable arrays to be stored in an accusable object or tuple ([[a],[b],[c]])
        - calculating a random number two times and parsing such a structure might be more efficient though...

2.5. alternately, could check in predetermined order (person -> weapon -> room), then 
    - if multiple accused items could be disproved, randomly pick one to show the accuser
    - but ONLY randomly if all items which could be disproved have not been disproven yet. 
    ex. -- 
    
    Player1 accuses Mrs. White with the rope in the library...
    // Player2 has Mr. Green, Prof. Plum, candlestick, and kitchen cards
    > Player2 cannot disprove
    // Player3 has Miss Scarlet, rope, library, and knife cards
    > Player3 can disprove
        // check accusableArrays for all accused items disprovable by Player3
        // - if the number of disprovable items still in their respective accusableArrays > 1,
        // - - then randomly pick one
        // - else, disprovable items = 1, show whichever one is left
    > Player3 shows accuser library card
    ...
    Player1 accuses Ms. Peacock with the rope in the library... 
    // Player2 has Mr. Green, Prof. Plum, candlestick, and kitchen cards
    > Player2 cannot disprove
    // Player3 has Miss Scarlet, rope, library, and knife cards
    > Player3 can disprove
        // check accusableArrays for all accused items disprovable by Player3
        // - if the number of disprovable items still in their respective accusableArrays > 1,
        // - - then randomly pick one
        // - else, disprovable items = 1, show whichever one is left
    > Player3 shows accuser rope card

    // ^ this would be a very beneficial style for the accuser. He/she could accuse the same thing 
    // multiple times to see where all the cards were... very unlike the real game of Clue

3. For added realism and bystander strategy, 
    - any player who could disprove more than one accused item randomly picks one,
    but if ever the item that player disproved before is accused again, the player will automatically show 
    the card he/she disproved before, as to not let the accuser figure out what other cards
    the player could have. 
    - this tactic has a similar outcome to the predetermined checking order, but is more punishing of 
    accidental accusations of items already disproved.

    - to counter, the human behind the accuser should refrain from accusing something that has
    already been disproved.
    
4. end-game speed checking
    - When an accusableArray contains one item, the checkAccusation() function does not continue
    to check hands for items in that array. This might speed up the checking process towards the 
    end of the game when suspect items have been narrowed down enough to know that the single
    item in an accusableArray cannot be disproved by any player. This indicates that the single item
    must be one of the three cards of the culprit.  
*/

// check final accusation against contents of confidential folder
function finish(result, player){
    if(result[0] === confidential.who){
        if(result[1] === confidential.what){
            if(result[2] === confidential.where){
                player.win = player.win + 1;        // update the winning player's win status
            }
        }
    }
};

function getScore(completionTime){
    var score = 0;
    // add 10 points for every item not disproven:
    score += 10 * accusablePeople.length;
    console.log("accusablePeople remaining: "+accusablePeople.length+", +"+(10*accusablePeople.length));
    score += 10 * accusableWeapons.length;
    console.log("accusableWeapons remaining: "+accusableWeapons.length+", +"+(10*accusableWeapons.length));
    score += 10 * accusableRooms.length;
    console.log("accusableRooms remaining: "+accusableRooms.length+", +"+(10*accusableRooms.length));

    // apply any multipliers for completion times
    // completionTime is measured in seconds, convert to minutes for scoring:
    if((completionTime/60).toFixed(3) < 1.300){
        score *= 3;
        console.log("Completion time: "+(completionTime/60).toFixed(2)+" minutes - 3x multiplier, "+score);
    }
    else if(((completionTime/60).toFixed(3) >= 1.300) && ((completionTime/60).toFixed(3) < 2.300)){
        score *= 2;
        console.log("Completion time: "+(completionTime/60).toFixed(2)+" minutes - 2x multiplier, "+score);
    }
    else if(((completionTime/60).toFixed(3) >= 2.300) && ((completionTime/60).toFixed(3) < 3.300)){
        score *= 1.5;
        console.log("Completion time: "+(completionTime/60).toFixed(2)+" minutes - 1.5x multiplier, "+score);
    }
    else{   // completionTime is larger than 3 and a half minutes, add no multiplier bonus
        score *= 1; // unnecessary
        console.log("Completion time: "+(completionTime/60).toFixed(2)+" minutes - 1x multiplier, "+score);
    }

    // there is probably a more efficient way to organize this structure
    // - maybe as its own 'bonusScore' object...?
    var lvl = "";
    var bonus = "";
    // "difficulty" setting bonus (based on number of players):
    if(numPlayers == 2){
        lvl = "easy, two players";
        score -= score * 0.10; // easy -> subtract 10% 
        bonus = "-10%";
    }
    else if(numPlayers == 4){
        lvl = "advanced, four players";
        score += score * 0.10; // advanced -> add 5%
        bonus = "+10%";
    }
    else if(numPlayers == 5){
        lvl = "hard, five players";
        score += score * 0.25; // hard -> add 10%
        bonus = "+25%";
    }
    else if(numPlayers == 6){
        lvl = "expert, six players";
        score += score * 0.50; // very hard (expert) -> add 20%
        bonus = "+50%";
    }
    else{
        lvl = "normal, three players";
        score += 0; // normal -> add 0% // unnecessary
        bonus = "+0%";
    }
    console.log("difficulty level bonus: " + lvl + ", " + bonus);
    return score.toFixed(2);
};


// ------------------------------------------------------------- 


function play(playerList){
    var t0 = performance.now();
    while(gameOver == false){
        console.log("Make a new accusation...");
        console.log("Accuser's hand: " + playerList[0].cards); // show accuser their hand to help with accusing
        accusationResult = makeAccusation(playerList); // returns correct accuseArray or [0,0,0].
    }

    finish(accusationResult, playerList[0]);
    var t1 = performance.now();         // records how many milliseconds passed after t0 was defined. 
    tTotalSeconds = (t1 - t0) / 1000;   // convert to seconds

    game.characters = allCharacters;
    game.weapons = allWeapons;
    game.rooms = allRooms;
    game.players = playerList;

    game.accusables.push(accusablePeople);
    game.accusables.push(accusableWeapons);
    game.accusables.push(accusableRooms);

    game.completionTime = String(tTotalSeconds.toFixed(2)) + " seconds";    // add completionTime to game data
    console.log("Game Over. " + playerList[0].name + " solved the case in " + (tTotalSeconds/60).toFixed(2) + " minutes ("+ tTotalSeconds.toFixed(2) +" seconds)!");
    winnerScore = getScore(tTotalSeconds);
    game.score = String(winnerScore) + " points";                           // add score to game data
    game; // should display game info at the end of each game

    console.log("Last Game Stats:");
    console.log(game); // will definitely display game info 
};

function resetVariables(){
    game = {
        'characters': null,
        'weapons': null,
        'rooms': null,
        'players': null,
        'setupTime': null,
        'completionTime': null,
        'accusables': [],
        'score': null
    };
    suspectPeople = [];
    suspectWeapons = [];
    suspectRooms = [];

    accusablePeople = [];
    accusableWeapons = [];
    accusableRooms = [];

    numPlayers = prompt("How many people are playing? (2 - "+allCharacters.length+")", "2");   // default to two players if user just presses enters
                                                                
    cardsInPlay = [];// = suspectPeople.concat(suspectRooms, suspectWeapons);
    numCardsInPlay = 0;// = cardsInPlay.length;
    gameOver = false;
    accusationResult = [];

    setupTotal = 0;  
    tTotalSeconds = 0;
    winnerScore = 0;
    playerList = []; // contains list of all players {name, list of cards in hand}

    name = Math.floor(Math.random() * (allCharacters.length - 0)) + 0;
    weapon = Math.floor(Math.random() * (allWeapons.length - 0)) + 0;
    room = Math.floor(Math.random() * (allRooms.length - 0)) + 0;

    confidential.who = allCharacters[name];    // return random name from characters array
    confidential.what = allWeapons[weapon];    // return random weapon from weapons array 
    confidential.where = allRooms[room];       // return random room from rooms array
    // ^ this is what the user will try to determine by accusing. 

    for(var o = 0; o < allCharacters.length; o++){
        accusablePeople.push(allCharacters[o]);
    }
    for(var p = 0; p < allWeapons.length; p++){
        accusableWeapons.push(allWeapons[p]);
    }
    for(var q = 0; q < allRooms.length; q++){
        accusableRooms.push(allRooms[q]);
    }
    setup();
};


const replaceChars = () => {
    var counter = 0;
    var allCharPrompt = prompt("List at least five single-word names (proper nouns) separated by spaces or press enter to skip.");
    if(allCharPrompt != ''){
        allCharacters = allCharPrompt.split(' ');
    }
    // remove any accidental null or space entries
    allCharacters.forEach(function(element){
        //console.log("Element in allCharacters: "+element);
        //console.log("ASCII value of first character of element ("+element+"): "+element.charCodeAt(0));
        if(element == ""){
            counter++;
        }
        if(element.charCodeAt(0) <= 47){
            allCharacters.splice(allCharacters.indexOf(element),1);
        }
    });
    allCharacters.splice(allCharacters.indexOf(""),counter); // sets the global array 'allCharacters'
    console.log("allCharacters after splice: ", allCharacters);
};  

const replaceWepns = () => {
    var counter = 0;
    var allWepnPrompt = prompt("List at least five single-word weapons separated by spaces or press enter to skip.");
    if(allWepnPrompt != ''){
        allWeapons = allWepnPrompt.split(' ');
    }
    // remove any accidental null or space entries
    allWeapons.forEach(function(element){
        //console.log("Element in allWeapons: "+element);
        //console.log("ASCII value of first character of element ("+element+"): "+element.charCodeAt(0));
        if(element == ""){
            counter++;
        }
        if(element.charCodeAt(0) <= 47){
            allWeapons.splice(allWeapons.indexOf(element),1);
        }
    });
    allWeapons.splice(allWeapons.indexOf(""),counter); // sets the global array 'allWeapons'
    console.log("allWeapons after splice: ", allWeapons);
};

const replaceRooms = () => {
    var counter = 0;
    var allRoomPrompt = prompt("List at least five single-word rooms separated by spaces or press enter to skip.");
    if(allRoomPrompt != ''){
        allRooms = allRoomPrompt.split(' ');
    }
    // remove any accidental null or space entries
    allRooms.forEach(function(element){
        //console.log("Element in allRooms: "+element);
        //console.log("ASCII value of first character of element ("+element+"): "+element.charCodeAt(0));
        if(element == ""){
            counter++;
        }
        if(element.charCodeAt(0) <= 47){
            allRooms.splice(allRooms.indexOf(element),1);
        }
    });
    allRooms.splice(allRooms.indexOf(""),counter); // sets the global array 'allRooms'
    console.log("allRooms after splice: ", allRooms);
};

// this function is used to stop checking new game item arrays when all three are adequate length
const stopChecking = () => {
    tryAgain = false;
};


// Allow the user to change the names of the accusable characters, weapons, and/or rooms.
// Can only take place between games.
// Returns the function needed to re-enter specific game items if previous array was too small, or to stop checking
function checkGameItems(){
    debugger;
    // added 6-19-2019 ---- 
    var brokeout = 0; 	// Flag is set to 1 if user needs or wants to re-enter any items -- only set when a condition is met where the code must break out of the current code block
    var lengths = []; 	// Hold the array of the length of each item array, so the user can input the correct number of items
    var p1 = "";
    let redo; 		// Flag to hold any items that the user is forced to or wants to re-enter
    var title = "";	// Contains the name of the list of items to be re-entered
    // --------------------

// added 6-19-2019 ------------------------------  
    lengths.push(allCharacters.length);
    lengths.push(allWeapons.length);
    lengths.push(allRooms.length);
    //console.log(lengths);
    
    // check if enough new items were added
    for(var i = 0; i < lengths.length; i++){
        // track i so that if the current array is too short, can adjust redo and title to the current array
        switch(i){
            case 0:
                title = "allCharacters";
                redo = replaceChars; // this assigns the replaceChars function to the variable 'redo'
                break;
            case 1:
                title = "allWeapons";
                redo = replaceWepns;
                break;
            case 2: 
                title = "allRooms";
                redo = replaceRooms;
            default:
                title = "Nothing is too short";
                redo = null;
        }
        // if ANY array has less than 5 items, warn the user
        //      if an array with less than 5 items has less than 3 items, 
        //          refill array with < 3 items. 
        //      else (array has either 3 or 4 items) -- which is dangerous, but okay
        //          ask user if he/she would like to add more or continue with 3-4 items
        if(lengths[i] < 5){
            console.log(title + " has less than 5 items");
            // warn user if any array is shorter than five items
            if(lengths[i] < 3){
                console.log(title + " has less than 3 items");
                // if any array has less than three items, force a redo
                alert("Warning. "+title+" contains less than three elements.\nGame will not play correctly. Must re-enter new game items.");
                brokeout = 1;
                break;
            }
            else{
                console.log(title + " has 3 or 4 items");
                alert("Warning. "+title+" contains less than five elements.\nGame might not play correctly.");
                p1 = prompt("Would you like to continue anyway or re-enter new items in "+title+"? (cont/re)","cont");
                while((p1 != 'cont') && (p1 != 're')){
                    p1 = prompt("Invalid Response. Would you like to continue anyway or re-enter new items in "+title+"? (cont/re)","cont");
                }
                if(p1 == "re"){
                    console.log("User decides to re-enter items"); 
                    brokeout = 1;
                    break;
                }
                else{
                    console.log("User is risky, decides to continue with 3 or 4 items in " + title + ".");
                    //return stopChecking;   // User continues to play with 4 or 3 items in one of the arrays
                }
            }
            console.log("outside length < 3 if/else");
        }
        // else -- length of array is >= 5, no problem -> ignore
        console.log("outside length < 5 if, "+title+" length >= 5");   
    }
    console.log("outside for loop, finished checking lengths or broke out"); 
    if(brokeout == 1){
        console.log("Definitely broke out of for loop...");
        console.log("title to redo: ", title);
        console.log("redo: ", redo);
        return redo(); // call whichever function was assigned to 'redo'
    }
    console.log("tryAgain: ", tryAgain); 
    // If brorekout == 0, then all array lengths should meet the requirements, 
    return stopChecking;
// ----------------------------------------------------
};

// -------- main ------------
var tryAgain;
var ready = prompt("Ready to start? (y/n): ","y");
if(ready === "y"){
    play(playerList);
    playAgain = prompt("You solved the case! Score: "+winnerScore+".\nPlay again? (y/n): \n","y");
    while(playAgain === "y"){
        tryAgain = true; 
        // default editMode selector to "n":
        editMode = prompt("\n------------------------------------------------------------------\nWould you like to edit the characters, weapons, and/or rooms? (y/n)\n------------------------------------------------------------------","n");
        if(editMode === "y"){
            replaceChars();
            replaceWepns();
            replaceRooms();
            while(tryAgain === true){   // keep checking and re-entering until all arrays are adequate length (>= 3 items)
                checkGameItems();
            }

        }
        resetVariables();
        while(numPlayers > allCharacters.length){
            console.log("Warning. Not enough game characters for all players.");
            numPlayers = prompt("Please make the number of players less than or equal to "+allCharacters.length+".");
        }
        play(playerList);
        playAgain = prompt("You solved the case! Score: "+winnerScore+". Play again? (y/n): ","y");
    }
    console.log("Case status: SOLVED");
}
else{
    console.log("Case status: UNSOLVED"); // if this is displayed, you were not ready to play the game
}