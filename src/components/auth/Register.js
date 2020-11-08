import React, { useRef } from "react"
import { useHistory } from 'react-router-dom'
//import "./Login.css"

export const Register = (props) => {
    const history = useHistory()
    const userName = useRef()
    const email = useRef()  
    const emailDialog = useRef()

    // get user by email if they have one... so, 
    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${email.current.value}`)
            .then(_ => _.json())
            .then(user => !!user.length) 
            // return true if there are no users with that email already in the database
    }

    const handleRegister = (e) => {
        e.preventDefault()

        // this checks if the password and verify password match:
        // Want this to check if email or username already exists...
        if (email.current.value !== "") {
            console.log(email.current.value);
            existingUserCheck()
                .then(() => {
                    // Add new user to database
                    fetch("http://localhost:8088/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email.current.value,
                            name: `${userName.current.value}`,
                        })
                    })
                        .then(_ => _.json())
                        .then(createdUser => {
                            console.log("CreatedUser: ", createdUser);
                            if (createdUser.hasOwnProperty("id")) {
                                sessionStorage.setItem("activeUser", createdUser.id)
                                history.push("/")
                            }
                        })
                })
        } else {
            emailDialog.current.showModal()
        }
    }

    return (
        <main className="container--register" style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--email" ref={emailDialog}>
                <div>Please enter an email</div>
                <button className="button--close" onClick={e => emailDialog.current.close()}>Close</button>
            </dialog>

            <form className="form--register" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Become a Clue Player</h1>
                <fieldset className="small">
                    <label htmlFor="inputUsername"> Username </label>
                    <input ref={userName} type="text"
                        name="userName"
                        className="form-control"
                        placeholder="ExampleUsername65"
                        required autoFocus />
                </fieldset>
                <fieldset className="small">
                    <label htmlFor="inputEmail"> Email address </label>
                    <input ref={email} type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email address"
                        required />
                </fieldset>
                <fieldset className="small">
                    <button type="submit">
                        Sign in
                    </button>
                </fieldset>
            </form>
        </main>
    )
}

