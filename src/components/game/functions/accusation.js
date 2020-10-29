

import React, { useState, useContext } from 'react';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {CardContext} from "../../card/CardProvider.js"




// pass in an object of cards --> can be an object with three card arrays in it
export const AccusationHTML = ({currentGameCards}) => {

    // This piece of the game renders the area where accusations can be made
    // This area includes three dropdown lists — one for each type of card in the current game
    // The user can only select one card of each type before pressing the "Accuse" button
        // If the user picks a character, then a room, but then wants to change the character
        // - the character chosen is replaced

    // Once the accusation is made ( by pressing the "accuse" button), the cards 
    const { cards, getCardsByGameId } = useContext(CardContext);

    const [accusableCards, setAccusableCards] = useState(currentGameCards); // pass in all cards in the current game, all are accusable at first
    

    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);
    const [dropdown3Open, setDropdown3Open] = useState(false);
    
    const toggle1 = () => setDropdown1Open(!dropdown1Open);
    const toggle2 = () => setDropdown2Open(prevState => !prevState);
    const toggle3 = () => setDropdown3Open(prevState => !prevState);

    let classNames = ["character", "1", "weapon", "2", "room", "3"];
    let classNamesIndex = 0;
    let dropdownCardId = 0;


    const createDropdownGeneric = (cardArray, isOpenVar, toggleFunc) => {
        classNamesIndex += 1; 
        // When classNamesIndex = 0 --> classNamesIndex += 1 = 1 
        //  ----> classNames[classNamesIndex - 1] = "character", classNames[classNamesIndex] = "1"
        // When classNamesIndex = 4 --> classNamesIndex += 1 = 5 
        //  ----> classNames[classNamesIndex - 1] = "room", classNames[classNamesIndex] = "3"
        return (
            <Dropdown className={`${classNames[classNamesIndex - 1]}Selector-dropdown${classNames[classNamesIndex]}`} isOpen={isOpenVar} toggle={toggleFunc}>
            <DropdownToggle caret>
                {classNames[classNamesIndex - 1]}
            </DropdownToggle>
            <DropdownMenu>
                {
                    cardArray.map(card => {
                        return (
                            <DropdownItem value={`${card}`}>{card}</DropdownItem>
                        )
                    })
                }
            </DropdownMenu>
        </Dropdown>

        )
    }


    const createCharDropdown = (cardArray) => {
        console.log("cardArray - createCharDropdown: ", cardArray);
        return (
            <select id="characterSelect" className="cardSelector-dropdown">
                <option value="default">Character</option>
                    {
                        cardArray.map(card => {
                            return  <option value={card.id}>{card.name}</option>
                        })
                    } 
            </select>



            // <Dropdown className="characterSelector-dropdown1" isOpen={dropdown1Open} toggle={toggle1}>
            //     <DropdownToggle caret>
            //         Character
            //     </DropdownToggle>
            //     <DropdownMenu>
            //         {
            //             cardArray.map(card => {
            //                 console.log(card);
            //                 dropdownCardId += 1
            //                 return (
            //                     <DropdownItem key={card.id}>{card.name}</DropdownItem>
            //                 )
            //             })
            //         }
            //     </DropdownMenu>
            // </Dropdown>
        )
    }

    const createWeaponDropdown = (cardArray) => {
        console.log("cardArray - createWeaponDropdown: ", cardArray);
        return (
            <select id="weaponSelect" className="cardSelector-dropdown">
                <option value="default">Weapon</option>
                    {
                        cardArray.map(card => {
                            return  <option value={card.id}>{card.name}</option>
                        })
                    } 
            </select>


            // <Dropdown className="weaponSelector-dropdown2" isOpen={dropdown2Open} toggle={toggle2}>
            //     <DropdownToggle caret>
            //         Weapon
            //     </DropdownToggle>
            //     <DropdownMenu>
            //         {
            //             cardArray.map(card => {
            //                 return (
            //                     <DropdownItem key={card.id}>{card.name}</DropdownItem>
            //                 )
            //             })
            //         }
            //     </DropdownMenu>
            // </Dropdown>
        )
    }

    const createRoomDropdown = (cardArray) => {
        console.log("cardArray - createRoomDropdown: ", cardArray);
        return (

            <select id="roomSelect" className="cardSelector-dropdown">
                <option value="default">Room</option>
                    {
                        cardArray.map(card => {
                            return  <option value={card.id}>{card.name}</option>
                        })
                    } 
            </select>

            
            // <Dropdown className="roomSelector-dropdown3" isOpen={dropdown3Open} toggle={toggle3}>
            //     <DropdownToggle caret>
            //         Room
            //     </DropdownToggle>
            //     <DropdownMenu>
            //         {
            //             cardArray.map(card => {
            //                 return (
            //                     <DropdownItem key={card.id}>{card.name}</DropdownItem>
            //                 )
            //             })
            //         }
            //     </DropdownMenu>
            // </Dropdown>
        )
    }

    /* <div>
                {createCharDropdown(accusableCards.charCards)}
                {createWeaponDropdown(accusableCards.weaponCards)}
                {createRoomDropdown(accusableCards.roomCards)}
            </div> */

    
    return (

        <div>
            {createCharDropdown(accusableCards.charCards)}
            {createWeaponDropdown(accusableCards.weaponCards)}
            {createRoomDropdown(accusableCards.roomCards)}
        </div> 
            // <ButtonDropdown isOpen={dropdown1Open} toggle={toggle1}>
            //     <DropdownToggle >
            //         Button Dropdown
            //     </DropdownToggle>
            //     <DropdownMenu>
            //         <DropdownItem header>Header</DropdownItem>
            //         <DropdownItem disabled>Action</DropdownItem>
            //         <DropdownItem>Another Action</DropdownItem>
            //         <DropdownItem divider />
            //         <DropdownItem>Another Action</DropdownItem>
            //     </DropdownMenu>
            // </ButtonDropdown>

    );
}