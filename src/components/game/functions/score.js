

export const getScore = (accusablePeople, accusableWeapons, accusableRooms, time, numPlayers) => {

    console.log("-------- time input for getScore() : ", Number(time));


    let completionTime = Number(time) / 1000;
    completionTime.toFixed(2);
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
    if(numPlayers === '2'){
        lvl = "easy, two players";
        score -= score * 0.10; // easy -> subtract 10% 
        bonus = "-10%";
    }
    else if(numPlayers === '4'){
        lvl = "advanced, four players";
        score += score * 0.10; // advanced -> add 5%
        bonus = "+10%";
    }
    else if(numPlayers === '5'){
        lvl = "hard, five players";
        score += score * 0.25; // hard -> add 10%
        bonus = "+25%";
    }
    else if(numPlayers === '6'){
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
