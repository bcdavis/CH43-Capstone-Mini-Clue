// This file defines how to interact with cards in any game, as well as what a card looks like.

import React from "react"
import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';

export const CardHTML = ({cardObj}) => {
    return (
        <div className="cardContainer" id={`card-${cardObj.id}`}>
            <Card>
                <CardBody>
                    <CardTitle>{cardObj.name}</CardTitle>
                    <CardSubtitle>{cardObj.type}</CardSubtitle>
                    <CardText>Additional info: gameId - {cardObj.gameId}, cardId - {cardObj.id}</CardText>
                    <Button>Accuse</Button>
                </CardBody>
            </Card>
        </div>
    )
}
