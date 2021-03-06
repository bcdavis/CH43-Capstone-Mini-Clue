/** This file describes the layout and functionality of the "how to play" page
 * This page includes three tabbed sections:
 *  - About
 *  - Rules
 *  - Scoring
 */


import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./HowToPlay.css";

export const HowToPlay = () => {

    return (
    <>
        <div className="biggerContainer">
            <div className="container">
                <Tabs>
                    <TabList>
                        <Tab><p>About</p></Tab>
                        <Tab><p>Rules</p></Tab>
                        <Tab><p>Scoring</p></Tab>
                    </TabList>
                
                    <TabPanel>
                        <h2>About the site</h2>
                        <section className="textBox">
                            <p>The game of Clue is played by two to six players attempting to individually figure out which one of the game's characters committed a murder with a particular weapon in a particular room before anyone else.</p>
                            <p>In this version of Clue, the only sentient player is the user. Games consist of one player constantly making accusatory guesses in an attempt to narrow down the culprit and can last as short as a minute (or less). Any other players specified cannot play against the user... yet.</p>
                            {/* <p>I began this project last Summer during my internship at Lonely Planet in the Factory at Franklin. As I learned more about JavaScript, I created a single-player version of Clue that can be played directly in the developer console of a browser. I translated that code into React JavaScript for this site, but had to cut some functionality due to limited time before today's presentation.</p> */}
                        </section>
                    </TabPanel>
                    <TabPanel>
                        <h2>Game Rules</h2>
                        <section className="textBox">
                            <p><strong>Starting the Game: </strong> Enter a number of players between 2 and 6 </p>
                            <p><strong>Playing: </strong> The list of cards on the left represents all the cards in the classic Clue game. Your job is to select a single character, weapon, and room from the dropdowns to the right and press the accuse button. If the character is not the culprit, it is removed from the list of available cards on the left, letting you know that it is disproven. Continue doing this until there's only one card left in each column or until you happen to accuse the actual culprit. Once you accuse correctly, the timer will stop and the culprit will be shown.</p>
                            
                        </section>
                    </TabPanel>
                    <TabPanel>
                        <h2>Scoring</h2>
                        <section className="textBox">
                            <p>The user's score is calculated first from counting the cards still remaining in their columns on the left. Then a multiplier depending on how quickly the case was solved is applied. Finally, a bonus is added depending on how many players the user played against. See the scoring scale below for more details.</p>
                            <p><strong>Cards still in play</strong></p>
                            <ul>
                                <li>+10 points for every item that did not have to be disproved.</li>
                            </ul>
                            <p><strong>Time multiplier</strong></p>
                            <ul>
                                <li>{"3 * points if completion time < 1 minute, 30 seconds ('three stars multiplier')"}</li>
                                <li>{"2 * points if completion time < 2 minutes, 30 seconds ('two stars multiplier')"}</li>
                                <li>{"1.5 * points if completion time < 3 minutes, 30 seconds ('one star multiplier')"}</li>
                                <li>{"1 * points if completion time >= 3 minutes, 30 seconds ('no star multiplier')"}</li>
                            </ul>
                            <p><strong>Opposing player number / difficulty</strong></p>
                            <ul>
                                <li>{"-10% when playing with just two players (easy)"}</li>
                                <li>{" +0% when playing with three players (normal)"}</li>
                                <li>{"+5% when playing with four players (advanced)"}</li>
                                <li>{"+10% when playing with five players (difficult)"}</li>
                                <li>{"+20% when playing with six players (very difficult)"}</li>
                            </ul>
                            
                        </section>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    </>
    )
}
