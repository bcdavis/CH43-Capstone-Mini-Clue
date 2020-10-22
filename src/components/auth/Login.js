import React, { useRef } from "react"
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom'
//import "./Login.css"

export const Login = props => {
    const history = useHistory()
    const email = useRef()
    //const password = useRef()
    const existDialog = useRef()
    const emailDialog = useRef()

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${email.current.value}`)
            .then(_ => _.json())
            .then(user => user.length ? user[0] : false)
    }

    const handleLogin = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then(exists => {
                // exists is the user that was returned from the existingUserCheck, or false
                // If email entered by user matches an email in the database and exists is not false:
                if (exists && exists.email === email.current.value) {
                    // log the user in
                    sessionStorage.setItem("activeUser", exists.id)
                    // navigate to home page
                    history.push("/")
                } else if (exists && exists.email !== email.current.value) {
                    // If user exists but email doesn't match, show email dialogue
                    emailDialog.current.showModal()
                } else if (!exists) {
                    // If user doesn't exist, show exists dialogue
                    existDialog.current.showModal()
                }
            })
    }

    return (
        <main className="container--login">
            <dialog className="dialog dialog--auth" ref={existDialog}>
                <div>User does not exist</div>
                <button className="button--close" onClick={e => existDialog.current.close()}>Close</button>
            </dialog>
            <dialog className="dialog dialog--email" ref={emailDialog}>
                <div>Email does not match</div>
                <button className="button--close" onClick={e => emailDialog.current.close()}>Close</button>
            </dialog>
            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>Social Slashers</h1>
                    <h2>Please sign in</h2>
                    <fieldset>
                        <label htmlFor="inputEmail"> Email address </label>
                        <input ref={email} type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email address"
                            required autoFocus />
                    </fieldset>
                    <fieldset>
                        <button type="submit">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Not a member yet?</Link>
            </section>
        </main>
    )
}