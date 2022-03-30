# Tug of Logic Game

##### A Philosophy Sports Web Application


## 1. Problem Statement:

###### People rarely speak what they consider to be true; instead, they may have heard it

###### from others, which is known as the Pedestal Problem. We don't genuinely learn

###### anything about the issue this way. There is relatively little reciprocal interaction

###### between them. We learn about our neighbours at best, and not about the subject at

###### all. Our neighbours’, on the other hand, may be superficial, and we don't dig deep

###### enough or critically enough.

###### Philosophy sports are live interactive games of competitive persuasion that are

###### device mediated. Tug of Logic is a philosophy sport device mediated game. Tug of

###### Logic involves using a device mediated online platform to engage the public in social

###### reasoning and critically confront one another. As a result, each participant will gain a

###### better understanding of the topic and be able to make an informed decision without

###### being put on a Pedestal Problem.The aim is to provide a main claim of discussion

###### that can be augmented or supported through supplementary Reasons-in-Play (RiP).

###### The main objective of this project is to develop a web based application that provides

###### visual representation of the Main Claim and the Reason-in-Play.

## 2. Significance of The Study

###### An individual may have an idea that may be controversial and wish to learn the

###### thoughts of other individuals regarding that idea. That individual may make a claim

###### on the app and share it with others. This enables people who wish to critically

###### challenge others' views, defend/validate their own ideas, or change their own

###### viewpoints by acquiring the perspective of others.

###### Participants will have detailed knowledge of the claim and will be able to modify their

###### own attitude about the claim with the help of online cooperation, live voting,

###### discussing, constructing grounds for and against the claim, and finally combining all

###### of this knowledge.


## 3. Proof of Progress

#### 3.1. Screenshots and Explanation:

```
Referee can create a game by clicking on the Create Game button.
```
```
Figure 3.1.1 Landing Page
```

Referee must set a main claim while creating a new game session.

```
Figure 3.1.2 Creating/Starting a Game
```
After finishing creating a new game session the Referee will have the starter game page
from where room code is displayed and that code is copyable by one click and can distribute
to the users.

```
Figure 3.1.3 Game Page View Admin
```

After getting the room code, users can join the game session. By default random names are
generated for players who want to remain anonymous. Players can edit and write their own
names.

```
Figure 3.1.4 User Joining a game
```
After joining the game, the user can view the game page and can see the main claim set by
the Referee. Players can vote on the main claim. A coloured bar is used as a visual
representation showing the voting statistics on the Main Claim by players.

```
Figure 3.1.5 User vote on the straw poll
```
The Referee has the ability to edit the Main Claim especially if a large number of players are
convinced and the referee would like to change the main claim to something more
debatable.

```
Figure 3.1.6 Referee can edit the main claim
```

After the initial Strawpoll Players and the Referee can submit their reasons to support or
reject the main claim

```
Figure 3.1.7 Referee/Player can add reason to play
```
```
Figure 3.1.8 Reason To List Item
```
All the submitted reasons to play are shown on the Reason To Play list. From the list Players
can vote to discuss or ignore any reason. Both the Referee and the Players are updated on
the voting statistics of each Reason To Play on the list

```
Figure 3.1.9 Players can vote on reason to play
```

Players can edit their own Reason To Play that they added. The Referee can also edit any
Player reason to play

```
Figure 3.1.10 Referee and Players can edit reason to play
```
```
Figure 3.1.11 Referee and Players can view of Reason to play list
```

```
Figure 3.1.12 Admin view of Reason to play list
```
After the Referee starts a reason in play (rip), the rip will be shown to all Players and
Referee.
Players and the Referee can see the current reason in play and while going through the
discussion, they can vote on the current reason in play and also be able to change their
vote.

```
Figure 3.1.13 User can vote on the current reason in play
```

According to the vote of the users the live graph of vote will be shown using a doughnut
chart.

```
Figure 3.1.14 Live vote of the reason in play
```
Referee can move any current reason in play to an established ground list. Referee can also
edit any current reason in play.

```
Figure 3.1.15 Admin can begin bout and start reason in play
```
After the referee establishes a rip then that will be shown in the established ground list.


```
Figure 3.1.16 Admin can establish a ground
```
Before finishing the game, the referee can start the final poll voting for the main claim.

```
Figure 3.1.17 Admin view
```
While the final poll voting starts , all component will go away only main claim and established
grounds list will be shown. Considering all these users will vote for the final poll.


```
Figure 3.1.18 Final Poll
```
```
After the vote for the final poll ends, the referee can finish the game and see the winners.
Those who changed their opinions are the real winners. Two lists will be shown who
changed their votes from not yet persuaded to convinced and vice versa.
```
```
Figure 3.1.19 Final Result
```
## 4. Software Design and Architecture

### Back End Architecture

```
The Back End Architecture of the application is made up of 3 main components. The server,
the database.and WebSocket
```

#### 4.1. The Database (Redis):

The database was implemented using Redis. Redis is an in-memory key-value data
structure storage solution. It provides many data types such as sets, hash sets, lists and
sorted sets. Redis was used because multiple users will be performing multiple operations
on a single game almost at the same time. Due to the number of operations multiple users
would be performing, a traditional on-disk database solution like Mongo or MySQL won’t be
fast enough to accommodate the number of reads and writes that could be happening.

#### 4.2. Database Architecture:


```
Entity Relationship Diagram of Tug-of-Logic
```
Entities:

1. Game
2. ReasonsToPlay
3. ReasonInPlay
4. EstablishedGrounds
5. StrawPoll - Convinced
6. EndPoll - NotYetPersuaded

Because Redis uses key-value storage, it doesn’t follow conventional Entity Relationship
standards. Each Game has a Game Entity. The Game entity is made up of a hashset which
stores the RoomCode which is a unique identifier of the current game, the Main Claim, 2
counters for votes. 1 vote for Convinced on the Main Claim and 1 counter for Not Yet
Persuaded on the Main Claim. Each Game has a Strawpoll and an End Poll which are made
up of 2 different sets. The StrawPoll is made up of a Convinced set and Not Yet Persuaded
set which both contain the names of the players who voted on those options. The player's
name can either end up in the Convinced set or the Not Yet Persuaded set at any given time
depending on their vote. The same principle applies to the EndPoll which is used to player
votes. At the end of each game the sets of Convinced and Not Yet Persuaded are compared
for differences to see which players changed their minds. Each Game can have multiple


ReasonsToPlay which are reasons to support or reject the Main Claim of the game. There is
also a discuss and ignore vote counter to know to record when a player votes to discuss or
ignore. Each ReasonToPlay has an id generated for it on creation which is used to identify it.
Each ReasonToPlay can be converted to a ReasonInPlay which is stored in a HashSet but
with an added Established or Contested counter to keep track of player votes. Each
ReasonInPlay can be moved to an EstablishedGrounds which stores each reason as a
HashSet.

```
RedisCommander View of Tug-of-Logic Game
```
#### 4.3. The Server (Node/Express):

The server is built on Node.js using the Express framework for performing server operations.
The main responsibility of the server is:

1. Storage and retrieval of information (game state) from the database
2. Store information about a game in progress
3. Handle socket connections to allow users play the game in a virtual room
4. Communicate with users on events that occur in a game session


```
Node.js + Socket.IO Connections
```
###### Socket.IO

A critical component of server operations is socket.IO. Request-Based approach towards the
development of this app is not suitable for the use case because all clients of the server
need to be updated on the current state of the game. The only way to know the current state
of the game is by making a request. However, this will be a tedious task for users because
they constantly have to refresh their browser to be updated on changes. Users need to be
updated on the state of the game in real time. Due to this an event driven approach was
taken to the development of the app using socket.IO (WebSockets). WebSocket is a
communication protocol similar to HTTP that supports full duplex communications channels
between the server and client using TCP. The main reason why an event driven approach is
being taken is because clients need to be updated by the server when a change in the state
of the game happens such as when new information is pushed by a player or voting on an
item occurs. Therefore, web sockets are used to keep clients connected rather than clients
constantly and manually having to make a request to know if a change in the game state has
occurred. Plus, there will be multiple events happening externally outside of the users
system at once and clients need to be updated in real time to know and view the changes
that occurred.

```
WebSocket BiDirection Communication
```
###### The backend api was set up using the bulletproof node.js architecture which

###### provides a bootstrap that implements a 3 layer architecture to separate concerns for

###### easier implementation of features and maintenance of the project. The 3 main layers

###### are the controller/socket layer which responds to web requests, socket events. The

###### service layer which contains business logic and the data access layer that handles

###### database transactions.


#### 4.4. Front End Architecture:

##### 4.4.1. User Interface Development with React

The user interface of the front end is built with React which is a JavaScript library for
developing interactive browser applications. It uses a component based approach where
each component encapsulates its own state. A combination of multiple components can be
used to develop a complex interactive user interface. React monitors state and detects
changes in state and updates the view based on changes to state. This means that when
there is a change in the app state the browser doesn’t have to reload the whole page instead
the component containing the corresponding state that has changed is updated.


```
Figure 4.5.1.1: React Division of Components for the Tug of Logic Game
```
Figure 4.5.1.1 shows React components of the Tug of Logic Game. Each component
displays relevant information from the game state and houses functions implemented for
critical features.

##### 4.4.2. State Management with Redux:

One of the major challenges of building the front end application is that there will be a lot of
operations performed by multiple users in the game room. Each user must be informed and
be able to view changes that have occurred in the state of the game such as when
information is added to the game state like a reason to play or a player votes on an item.
Users need to view changes in real time without reloading the web page or requesting for
new information. These changes will be happening in real time with the use of sockets and
need to be properly reflected on the Referees and Players viewpoint. Due to the complexity
of changes happening to the state of the game, React's default state management solution
(useState) will not be sufficient to manage real time changes to the state of the game in a
user's device. React is only good at rendering the current state of the application but not
good for performing complex updates. What complicates state management further is that
changes in state will occur outside the current user's browser because changes in state will
be triggered by other players in the game. These changes must be reflected in the user
browser when the changes are emitted by the server. A better solution to help in the


management of the state of the game in a user's browser is Redux. Redux is a predictable
state container for JavaScript that manages an applications state and triggers actions to
change the state of the application. Redux was used to manage the state of the game in the
user's browser and dictate what changes in state should occur when an action is emitted by
the server.

```
Figure 4.5.2.1: React + Redux Architecture
```
Redux architecture is made up of 4 essential component:

###### Store:

This holds the state of the current application. React gets the current state of the game from
the store.

###### Dispatcher:

This is used by React when a user performs an action. It lets Redux know the type of action
that was performed or/and the data that should be sent to the store to alter the state.

###### Reducer:

A reducer performs the actual state alteration and returns the new state to the store. When a
change in state occurs, react automatically notices and updates the view because it is
reading from the state from the store.


###### Action:

An action is basically a string that lets redux know what reducer to engage to change the
state

##### 4.4.3. Socket.IO-Client

Socket.IO-Client is a web browser based JavaScript library that manages connection to the
server web socket. Socket.IO-Client will receive data and events from the server. In order to
update the Redux state of the application a socket middleware was implemented which
completely alters the Redux architecture of the application from Figure 4.5.2.1 to Figure
4.5.3.1. This middleware is initialized when the browser loads the application.
Every time the socket middleware receives an event from the server it dispatches an action
to the redux store with the information received. Whenever a dispatch action is triggered and
matches any set list of actions in the socket middleware, the middleware emits the
information in the dispatch action to the server.

```
Figure 4.5.3.1: React + Redux Architecture with Socket.IO-Client Integration
```
Figure 4.5.3.2 is an example of socket-io middleware implementation with redux.

const createSocketMiddleware = () => {
/**
* Data emitted from the server should be placed here.
* use storeAPI.dispatch to send the data into redux state
*/


// returns a room code on app request
return storeAPI => {
// used to update the game state
socket.on("game state", data => {
storeAPI.dispatch({
type: "game/setGameState",
payload: data,
});

});

// used to the main claim and its votes
socket.on("main claim vote", data => {
storeAPI.dispatch({
type: "game/setMainClaimState",
payload: data,
});
});

/**
* Data to be set to the server should be placed here
* Check for the type of action to emit to the server
*/
return next => action => {
// tells the server to start a new game
if (action.type === "game/emitStartGame") {
socket.emit("initGame", action.payload);
return;

}
// increase discuss vote for a Reason To Play
if (action.type === "game/emitVoteDiscussReasonToPlay") {
socket.emit("upVoteDiscussReasonToPlay", action.payload);
}
return next(action);
};
};
};

```
Figure 4.5.3.2: Socket Implementation Example
```

### 5. Tests

```
We used the user based testing for the project while we built and implemented any new
feature and it’s being reviewed by our client. Each week we had a meeting and we tested
and discussed what to change and integrate. If any new typography or any positioning ,
spacing, changing colour or text anything is needed we noted it down while doing live testing
with our client. In the next week we solved all it was asked in our last meeting and started
testing on the new implemented features. After our final implementation we played the whole
game with different users and got feedback from them and refactored some features
according to their suggestion.
```
###### “It’s looking great! I love it, can’t believe you guys made this!” – Sam

###### “The project is so clean and easy to navigate! Great Job.” – Anik

###### “I love how everything is responding live and real time” – Sultan

###### “Like the way of implementation of live graphs!” – Nolan

###### “I like it! Maybe you can use some fancy font styles?” – Rajan

###### “Wow! This is amazing!! Finally someone implemented just like what i wanted” –

###### Professor Michael Picard (Creator of this game and Our main client)

### 6. Project Setup

#### 6.1. Prerequisites

```
A major requirement to run this project is Redis. The setup process for redis on Windows is
quite complicated and it is generally recommended not to run Redis on Windows. Therefore,
redis was set up using Docker to isolate environments.
```
1. Install Node.js (https://nodejs.org/en/)
2. Install Docker (https://www.docker.com/get-started)
3. In the command line run the following commands to install the necessary docker
    containers

```
docker pull redis
```
```
docker pull rediscommander/redis-commander
```
4. Below is a docker compose file needed to run the containers for the application

```
# save this file as docker-compose.yml
```

```
version: '3.9'
```
```
services:
```
```
redis:
image: redis
restart: always
ports:
```
- 6379 : 6379

```
redis-commander:
image: rediscommander/redis-commander:latest
restart: always
environment:
```
- REDIS_HOSTS=localhost:redis: 6379
ports:
- 8081 : 8081
5. The project directory structure can be set up as follows

```
tug-of-logic/
tug-of-logic-app/
tug-of-logic-api/
docker-compose.yml
```
#### 6.2. Server Setup (tug-of-logic-api)

1. Create a .env file in the tug-of-logic-api folder as follows

```
# JSON web token (JWT) secret: this keeps our app's user authentication
secure
# This secret should be a random 20-ish character string
JWT_SECRET ='p4sta.w1th-b0logn3s3-s@uce'
JWT_ALGO='RS256'
```
```
# Mongo DB
# Local development
MONGODB_URI='mongodb://root:root@localhost:27017/tugologic?authSource=ad
min'
```

```
# Port
PORT= 3000
```
```
# Debug
LOG_LEVEL='debug'
```
2. In the tug-of-logic-api directory run the following commands

```
# in the tug-of-logic-api directory
```
```
# start docker-compose
docker-compose up -d
```
```
# install the necessary dependencies
npm install
```
```
# start the app
npm run dev
```
On running docker-compose up -d, redis should run on the port 6379 by default and the
server should be able to connect to it by default. Unless there is an app running on that port

#### 6.3. Front End Setup (tug-of-logic-app)

1. Create a .env file in the tug-of-logic-app folder

```
PORT= 8080
REACT_APP_API_URL=http://localhost:3000 # tug-of-logic-api url
```
2. In the tug-of-logic-app directory run the following commands

```
# in the tug-of-logic-app directory
```
```
npm install craco -g
```
```
npm install
```

```
npm start
```
3. Navigate to [http://localhost:8080/](http://localhost:8080/)

### 7. References:

#### 7.1. Bibliography

1. Ovenden, I. (2017). Redux WebSocket Integration. Available at:
    https://medium.com/@ianovenden/redux-websocket-integration-c1a0d22d3189
2. Erikson, M. (2018). Redux WebSocket Middleware Example. Available at:
    https://gist.github.com/markerikson/3df1cf5abbac57820a20059287b4be58
3. Bulletproof Node.js Project Architecture. (2019). Available at:
    https://softwareontheroad.com/ideal-nodejs-project-
    structure/?utm_source=github&utm_medium=readme


