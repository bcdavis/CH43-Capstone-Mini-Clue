// This file defines how to interact with cards in any game, as well as what a card looks like.

import React from "react"
import "./Card.css"
import {
    Card, CardBody, CardTitle
  } from 'reactstrap';


export const CardHTML = ({cardObj}) => {
    
    return (
        <div className={`cardContainer cardType--${cardObj.type}`} id={`card-${cardObj.id}`}>
            <Card>
                <CardBody>
                    <CardTitle>{cardObj.name}</CardTitle>
                </CardBody>
            </Card>
        </div>
    )
}


