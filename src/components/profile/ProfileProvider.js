import React, { useState, createContext } from "react"

export const ProfileContext = createContext()

export const ProfileProvider = (props) => {
    const [profiles, setProfiles] = useState([])
    //const [profile, setProfile] = useState([])
    const userId = sessionStorage.getItem("activeUser")

    const getProfiles = () => {
        return fetch(`http://localhost:8088/users`)
            .then(res => res.json())
            .then(setProfiles) // is this necessary?
    }

    // Grab a custom game that corresponds to a particular game Id (classic games have Profile with gameId = 0)
    const getProfileById = (profileId) => {
        return fetch(`http://localhost:8088/users?id=${profileId}`)
            .then(res => res.json())
            
    }

    // Grab the active user's profile
    const getActiveUserProfile= () => {
        return fetch(`http://localhost:8088/users?id=${userId}`)
            .then(res => res.json())
            
    }

    // STRETCH GOAL -- allow user to delete their account
    // This also requires that any custom games the user created, 
    // their respective cards, and their best game score to be removed. 
    const deleteCurrentProfile = () => {
        return fetch(`http://localhost:8088/users?id=${userId}`, {
            method: "DELETE"
        })
            .then(getProfiles)
    }

    return (
        <ProfileContext.Provider value={{
            profiles, getProfiles, getProfileById, getActiveUserProfile, deleteCurrentProfile
        }}>
            {props.children}
        </ProfileContext.Provider>
    )
}