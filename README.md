## Mini Clue

The game of Clue is played by two to six players attempting to individually figure out which one of the game's characters committed a murder with a particular weapon in a particular room before anyone else.

In this version of Clue, the only sentient player is the user. Games consist of one player constantly making accusatory guesses in an attempt to narrow down the culprit and can last as short as a minute (or less). Any other players specified cannot play against the user... yet.

## Run This Program

Clone this repository into a new directory in your workspace.

Navigate into the cloned directory and make a new directory called `api` by running `mkdir api`

Navigate into the new `api` directory and run `touch database.json`

To populate the database.json file you can run the following script on the command line: 

```
    echo "{
    "users": [],
    "bestGameResults": [],
    "cards": [
        {
            "id": 1,
            "name": "Colonel Mustard",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 2,
            "name": "Mr. Green",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 3,
            "name": "Professor Plum",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 4,
            "name": "Mrs. White",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 5,
            "name": "Miss Scarlet",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 6,
            "name": "Mrs. Peacock",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 7,
            "name": "Conservatory",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 8,
            "name": "Ballroom",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 9,
            "name": "Billiards Room",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 10,
            "name": "Great Hall",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 11,
            "name": "Library",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 12,
            "name": "Lounge",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 13,
            "name": "Study",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 14,
            "name": "Kitchen",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 15,
            "name": "Dining Room",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 16,
            "name": "Lead Pipe",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 17,
            "name": "Knife",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 18,
            "name": "Candlestick",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 19,
            "name": "Gun",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 20,
            "name": "Rope",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 21,
            "name": "Wrench",
            "type": "weapon",
            "gameId": 0
        }
    ]
}
" >> database.json
```

Or open the database.json file manually and paste in the following code: 

```
{
    "users": [],
    "bestGameResults": [],
    "cards": [
        {
            "id": 1,
            "name": "Colonel Mustard",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 2,
            "name": "Mr. Green",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 3,
            "name": "Professor Plum",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 4,
            "name": "Mrs. White",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 5,
            "name": "Miss Scarlet",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 6,
            "name": "Mrs. Peacock",
            "type": "character",
            "gameId": 0
        },
        {
            "id": 7,
            "name": "Conservatory",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 8,
            "name": "Ballroom",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 9,
            "name": "Billiards Room",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 10,
            "name": "Great Hall",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 11,
            "name": "Library",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 12,
            "name": "Lounge",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 13,
            "name": "Study",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 14,
            "name": "Kitchen",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 15,
            "name": "Dining Room",
            "type": "room",
            "gameId": 0
        },
        {
            "id": 16,
            "name": "Lead Pipe",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 17,
            "name": "Knife",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 18,
            "name": "Candlestick",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 19,
            "name": "Gun",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 20,
            "name": "Rope",
            "type": "weapon",
            "gameId": 0
        },
        {
            "id": 21,
            "name": "Wrench",
            "type": "weapon",
            "gameId": 0
        }
    ]
}

```

If you don't have JSON server already installed, run the following script in the terminal:

`npm install -g json-server`

To serve the database, in a new terminal window, navigate to the new `api` directory in this project's directory and run `json-server -p 8088 -w database.json`. This hosts the database locally for you to access on your machine with the app.

To run the app, in a new terminal window, navigate into the `src` directory and run `npm start` to start the program.


## Known Issues

When playing a game, if the user clicks either the "Home" or "How to Play" button in the nav bar, the page breaks due to the timer trying to update a DOM element that no longer exists. If you want to navigate away from the gameboard page, make sure to perform a page reload to reset the new page. 


## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
