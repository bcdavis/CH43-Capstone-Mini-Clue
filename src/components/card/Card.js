// This file defines how to interact with cards in any game, as well as what a card looks like.

import React, { useState } from "react"
import "./Card.css"
import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
  } from 'reactstrap';


export const CardHTML = ({cardObj}) => {
    
    return (
        <div className={`cardContainer cardType--${cardObj.type}`} id={`card-${cardObj.id}`}>
            <Card>
                <CardBody>
                    <CardTitle>{cardObj.name}</CardTitle>
                    {/* <CardSubtitle>{cardObj.type}</CardSubtitle> */}
                    {/* <CardText>Additional info: gameId - {cardObj.gameId}, cardId - {cardObj.id}</CardText> */}
                    {/* <Button className="accuse-button" type="button">Accuse</Button> */}
                </CardBody>
            </Card>
        </div>
    )
}


