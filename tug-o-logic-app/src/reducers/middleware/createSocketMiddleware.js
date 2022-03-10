import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const createSocketMiddleware = () => {
	/**
	 * Data emitted from the server should be placed here.
	 * use storeAPI.dispatch to send the data into redux state
	 */

	// returns a room code on app request
	return storeAPI => {
		const tryReconnect = function () {
			if (!socket.connected) {
				socket.connect();
			}
		};

		let connectionInterval;

		// Handles socket connection event
		socket.on("connect", () => {
			clearInterval(connectionInterval);
			const roomCode = storeAPI.getState().game.roomCode;
			storeAPI.dispatch({
				type: "game/setConnectedToSocket",
				payload: { connectedToSocket: true },
			});
			if (roomCode) {
				socket.emit("joinRoom", { roomCode: roomCode });
			}
		});

		// Handle socket disconnection event. Set a timer to reconnect
		socket.on("disconnect", () => {
			connectionInterval = setInterval(tryReconnect, 1500);
			storeAPI.dispatch({
				type: "game/setConnectedToSocket",
				payload: { connectedToSocket: false },
			});
		});

		socket.on("room code", data => {
			storeAPI.dispatch({
				type: "game/setRoomCode",
				payload: data,
			});
		});

		// starts a game on player request
		socket.on("game created", data => {
			storeAPI.dispatch({
				type: "game/initGame",
				payload: data,
			});
		});

		socket.on("send to room", data => {
			storeAPI.dispatch({
				type: "game/setRoomCode",
				payload: data,
			});
		});

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

		// adds a reason to play to the app state
		socket.on("add reason", data => {
			storeAPI.dispatch({
				type: "game/addReasonToPlay",
				payload: data,
			});
		});

		// sends a reason-to-play that has been editted to the redux store
		socket.on("update rtp", data => {
			storeAPI.dispatch({
				type: "game/updateReasonToPlay",
				payload: data,
			});
		});

		// recieves a reason in play to begin a bout of logical skirmish
		socket.on("bout begun", data => {
			storeAPI.dispatch({
				type: "game/boutBegun",
				payload: data,
			});
		});

		// sends a reason-in-play that has been editted to the redux store
		socket.on("updated rip", data => {
			storeAPI.dispatch({
				type: "game/updateReasonInPlay",
				payload: data,
			});
		});

		// sends the state containing votes of the reason in play to the redux store
		socket.on("rip vote", data => {
			storeAPI.dispatch({
				type: "game/updateReasonInPlay",
				payload: data,
			});
		});

		// recieves an updated established grounds and sends it to the redux store
		socket.on("established grounds", data => {
			storeAPI.dispatch({
				type: "game/updateEstablishedGrounds",
				payload: data,
			});
		});

		// recieves the state of the main claim when referee triggers final poll
		socket.on("updated endpoll", data => {
			storeAPI.dispatch({
				type: "game/setMainClaimState",
				payload: data,
			});
		});

		// recieves the winners of the game and sends to redux store
		socket.on("give winners", data => {
			storeAPI.dispatch({
				type: "game/setWinners",
				payload: data,
			});
		});

		/**
		 * Data to be set to the server should be placed here
		 * Check for the type of action to emmit to the server
		 */
		return next => action => {
			// tells the server to start a new game
			if (action.type === "game/emitStartGame") {
				socket.emit("initGame", action.payload);
				return;
			}

			// puts player in the desired room to join the game
			if (action.type === "game/emitJoinGame") {
				socket.emit("joinRoom", action.payload);
				return;
			}

			// votes contested for the main claim
			if (action.type === "game/emitVote") {
				socket.emit("voteOnMainClaim", action.payload);
				return;
			}

			// updates the main claim of the game
			if (action.type === "game/emitUpdateMainClaim") {
				socket.emit("initGame", action.payload);
				return;
			}

			// sending a user added reason to play to the server
			if (action.type === "game/emitAddReasonToPlay") {
				socket.emit("addReasonToPlay", action.payload);
			}

			// increase discuss vote for a Reason To Play
			if (action.type === "game/emitVoteDiscussReasonToPlay") {
				socket.emit("upVoteDiscussReasonToPlay", action.payload);
			}

			// decrease discuss vote for a Reason To Play
			if (action.type === "game/emitUnvoteDiscussReasonToPlay") {
				socket.emit("downVoteDiscussReasonToPlay", action.payload);
			}

			// increase ignore vote for a Reason To Play
			if (action.type === "game/emitVoteIgnoreReasonToPlay") {
				socket.emit("upVoteIgnoreReasonToPlay", action.payload);
			}

			// decrease ignore vote for a Reason To Play
			if (action.type === "game/emitUnvoteIgnoreReasonToPlay") {
				socket.emit("downVoteIgnoreReasonToPlay", action.payload);
			}

			// send a reason to begin a bout or reason in play
			if (action.type === "game/emitBeginBout") {
				socket.emit("beginBout", action.payload);
			}

			// send an editted reason-to-play to the server
			if (action.type === "game/emitUpdateReasonToPlay") {
				socket.emit("updateReasonToPlay", action.payload);
			}

			// send an editted reason-in-play to the server
			if (action.type === "game/emitUpdateReasonInPlay") {
				socket.emit("updateReasonInPlay", action.payload);
			}

			// increase established vote for a Reason To Play
			if (action.type === "game/emitUpVoteEstablishedReasonInPlay") {
				socket.emit("upVoteEstablishedReasonInPlay", action.payload);
			}

			// decrease established vote for a Reason To Play
			if (action.type === "game/emitDownVoteEstablishedReasonInPlay") {
				socket.emit("downVoteEstablishedReasonInPlay", action.payload);
			}

			// increase contested vote for a Reason In Play
			if (action.type === "game/emitUpVoteContestedReasonInPlay") {
				socket.emit("upVoteContestedReasonInPlay", action.payload);
			}

			// decrease contested vote for a Reason In Play
			if (action.type === "game/emitDownVoteContestedReasonInPlay") {
				socket.emit("downVoteContestedReasonInPlay", action.payload);
			}

			// move the current reason in play to established grounds
			if (action.type === "game/emitMoveRIPToEstablishedGrounds") {
				socket.emit("moveRIPToEstablishedGrounds", action.payload);
			}

			// change the game phase to endpoll
			if (action.type === "game/emitStartEndPoll") {
				socket.emit("startEndPoll", action.payload);
			}

			// request the server return a list of winners
			if (action.type === "game/emitGetWinners") {
				socket.emit("getWinners", action.payload);
			}

			return next(action);
		};
	};
};

export default createSocketMiddleware;
