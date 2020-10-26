// This file describes the page view of the active user's information:
/**
 * - username
 * - email 
 * - best classic game score as well as leaderboard rank
 * - 
 */

import React, { useContext, useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { ProfileContext } from "./ProfileProvider.js"
import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle
  } from 'reactstrap';


export const MyProfile = () => {
    //let flag = 0;
    //const history = useHistory();

    // Need to get the current user's profile

    const { getProfileById, getActiveUserProfile } = useContext(ProfileContext)

    const [myProfile, setMyProfile] = useState({})

    const {userId} = useParams();
    const profileId1 = userId;
    //console.log(useParams());
    //console.log("userId / profileId1: ", profileId1);

    //const profileId2 = sessionStorage.getItem("activeUser");
    //console.log("userId / profileId2: ", profileId2)

    //console.log("Flag status: ", flag);

    /*
    if (flag === 0){
        getActiveUserProfile()
        .then(myProf => {
            setMyProfile(myProf)
        })
        .then(() => {
            flag = !!1;
            console.log("myProfile----: ", myProfile);
        })
    }


    if (flag === 0){
            flag = 1;
            getProfileById(profileId2) // get the user associated with that id
            .then(profile => {
                flag = 1;
                setMyProfile(profile)
            })
        }
    */

    
    
    useEffect(() => {
        console.log("useEffect: ", profileId1);
        // If profileId exists -- if it is gotten from the url via useParams
        getActiveUserProfile() // get the user associated with that id
            .then((response) => {
                setMyProfile(response)
            })
            .then(() => {
                console.log("MyProfile --- : ", myProfile);
            })
    }, [])
    

    return (
        <>
            <h1 className="myProfile--title">THIS IS THE PAGE FOR MY PROFILE</h1>
            <section className="profileCard" id={`profileId--a`}>
                <Card>
                    <CardBody>
                        <CardTitle className="profileCard--username">
                            Username: {myProfile?.username}
                            
                        </CardTitle>
                        <CardSubtitle className="profileCard--email">
                            Email: {myProfile?.email}
                            {/* {profile.email} */}
                        </CardSubtitle>
                        <CardText className="profileCard--info">
                            Best classic game score: {myProfile?.bestClassicGameScore} 
                            <br></br>
                            Number of custom games created: {myProfile?.myCustomGames}

                        </CardText>
                    </CardBody>

                </Card>

            </section>
        </>
    )
}