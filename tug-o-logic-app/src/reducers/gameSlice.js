import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
	name: "game",
	initialState: {
		role: null,
		roomCode: null,
		state: null,
		playerName: null,
		mainClaim: null,
		convinced: 0,
		notYetPersuaded: 0,
		didVoteConvinced: false,
		didVoteNotYetPersuaded: false,
		reasonsToPlay: [],
		reasonInPlay: null,
		establishedGrounds: [],
		winners: null,
		connectedToSocket: false,
	},
	reducers: {
		setRole: (state, action) => {
			state.role = action.payload.role;
		},
		setRoomCode: (state, action) => {
			return {
				...state,
				roomCode: action.payload.roomCode,
			};
		},
		initGame: (state, action) => {
			return {
				...state,
				roomCode: action.payload.roomCode,
				mainClaim: action.payload.mainClaim,
				state: action.payload.state,
				convinced: action.payload.convinced,
				notYetPersuaded: action.payload.notYetPersuaded,
			};
		},
		setMainClaimState: (state, action) => {
			return {
				...state,
				mainClaim: action.payload.mainClaim,
				state: action.payload.state,
				convinced: action.payload.convinced,
				notYetPersuaded: action.payload.notYetPersuaded,
				didVoteConvinced:
					state.state === "strawpoll" && action.payload.state === "endpoll"
						? false
						: state.didVoteConvinced,
				didVoteNotYetPersuaded:
					state.state === "strawpoll" && action.payload.state === "endpoll"
						? false
						: state.didVoteNotYetPersuaded,
			};
		},
		setGameState: (state, action) => {
			if (action.payload.reasonsToPlay) {
				for (const oldReason in state.reasonsToPlay) {
					let newNewReason = action.payload.reasonsToPlay.find(
						newReason => oldReason._id === newReason._id
					);
					if (oldReason.didVoteDiscuss) {
						newNewReason.didVoteDiscuss = oldReason.didVoteDiscuss;
					}
					if (oldReason.didVoteIgnore) {
						newNewReason.didVoteIgnore = oldReason.didVoteDiscuss;
					}
				}
			}
			return {
				...state,
				mainClaim: action.payload.room.mainClaim,
				state: action.payload.room.state,
				convinced: action.payload.room.convinced,
				notYetPersuaded: action.payload.room.notYetPersuaded,
				reasonsToPlay: action.payload.reasonsToPlay
					? action.payload.reasonsToPlay
					: state.reasonsToPlay,
				reasonInPlay: action.payload.reasonInPlay
					? action.payload.reasonInPlay
					: state.reasonInPlay,
				establishedGrounds: action.payload.establishedGrounds
					? action.payload.establishedGrounds
					: state.establishedGrounds,
			};
		},
		setPlayerName: (state, action) => {
			return {
				...state,
				playerName: action.payload.playerName,
			};
		},
		voteConvinced: state => {
			return {
				...state,
				didVoteNotYetPersuaded:
					state.didVoteNotYetPersuaded === true
						? !state.didVoteNotYetPersuaded
						: state.didVoteNotYetPersuaded,
				didVoteConvinced: !state.didVoteConvinced,
			};
		},
		voteNotYetPersuaded: state => {
			return {
				...state,
				didVoteConvinced:
					state.didVoteConvinced === true ? !state.didVoteConvinced : state.didVoteConvinced,
				didVoteNotYetPersuaded: !state.didVoteNotYetPersuaded,
			};
		},
		addReasonToPlay: (state, action) => {
			return {
				...state,
				reasonsToPlay: [...state.reasonsToPlay, action.payload],
			};
		},
		updateReasonToPlay: (state, action) => {
			const reasonToEdit = state.reasonsToPlay.find(reason => reason._id === action.payload._id);
			reasonToEdit.reason = action.payload.reason;
			reasonToEdit.discuss = action.payload.discuss;
			reasonToEdit.ignore = action.payload.ignore;
		},
		setConnectedToSocket: (state, action) => {
			return {
				...state,
				connectedToSocket: action.payload.connectedToSocket,
			};
		},
		voteDiscussReasonToPlay: (state, action) => {
			const reasonToVote = state.reasonsToPlay.find(reason => reason._id === action.payload);
			reasonToVote.didVoteDiscuss = true;
		},
		voteIgnoreReasonToPlay: (state, action) => {
			const reasonToVote = state.reasonsToPlay.find(reason => reason._id === action.payload);
			reasonToVote.didVoteIgnore = true;
		},
		unvoteDiscussReasonToPlay: (state, action) => {
			const reasonToVote = state.reasonsToPlay.find(reason => reason._id === action.payload);
			reasonToVote.didVoteDiscuss = false;
		},
		unvoteIgnoreReasonToPlay: (state, action) => {
			const reasonToVote = state.reasonsToPlay.find(reason => reason._id === action.payload);
			reasonToVote.didVoteIgnore = false;
		},
		boutBegun: (state, action) => {
			const newReasonsToPlay = state.reasonsToPlay.filter(
				reason => reason._id !== action.payload._id
			);
			return {
				...state,
				reasonInPlay: action.payload,
				reasonsToPlay: [...newReasonsToPlay],
			};
		},
		updateReasonInPlay: (state, action) => {
			return {
				...state,
				reasonInPlay: action.payload
					? Object.assign({}, state.reasonInPlay, action.payload)
					: action.payload,
			};
		},
		upVoteEstablishedReasonInPlay: state => {
			return {
				...state,
				reasonInPlay: {
					...state.reasonInPlay,
					didVoteEstablished: true,
				},
			};
		},
		upVoteContestedReasonInPlay: state => {
			return {
				...state,
				reasonInPlay: {
					...state.reasonInPlay,
					didVoteContested: true,
				},
			};
		},
		downVoteEstablishedReasonInPlay: state => {
			return {
				...state,
				reasonInPlay: {
					...state.reasonInPlay,
					didVoteEstablished: false,
				},
			};
		},
		downVoteContestedReasonInPlay: state => {
			return {
				...state,
				reasonInPlay: {
					...state.reasonInPlay,
					didVoteContested: false,
				},
			};
		},
		updateEstablishedGrounds: (state, action) => {
			return {
				...state,
				establishedGrounds: [...action.payload],
			};
		},
		setWinners: (state, action) => {
			return {
				...state,
				winners: action.payload,
			};
		},
		emitStartGame: () => {},
		emitJoinGame: () => {},
		emitVote: () => {},
		emitUpdateMainClaim: () => {},
		emitAddReasonToPlay: () => {},
		emitVoteDiscussReasonToPlay: () => {},
		emitVoteIgnoreReasonToPlay: () => {},
		emitUnvoteDiscussReasonToPlay: () => {},
		emitUnvoteIgnoreReasonToPlay: () => {},
		emitBeginBout: () => {},
		emitUpdateReasonToPlay: () => {},
		emitUpdateReasonInPlay: () => {},
		emitUpVoteEstablishedReasonInPlay: () => {},
		emitUpVoteContestedReasonInPlay: () => {},
		emitDownVoteEstablishedReasonInPlay: () => {},
		emitDownVoteContestedReasonInPlay: () => {},
		emitMoveRIPToEstablishedGrounds: () => {},
		emitStartEndPoll: () => {},
		emitGetWinners: () => {},
	},
});

export const {
	setRole,
	setPlayerName,
	setRoomCode,
	initGame,
	voteConvinced,
	voteNotYetPersuaded,
	editMainClaim,
	addReasonToPlay,
	setConnectedToSocket,
	voteDiscussReasonToPlay,
	voteIgnoreReasonToPlay,
	unvoteDiscussReasonToPlay,
	unvoteIgnoreReasonToPlay,
	upVoteEstablishedReasonInPlay,
	upVoteContestedReasonInPlay,
	downVoteEstablishedReasonInPlay,
	downVoteContestedReasonInPlay,
	emitStartGame,
	emitJoinGame,
	emitVote,
	emitUpdateMainClaim,
	emitAddReasonToPlay,
	emitVoteDiscussReasonToPlay,
	emitVoteIgnoreReasonToPlay,
	emitUnvoteDiscussReasonToPlay,
	emitUnvoteIgnoreReasonToPlay,
	emitBeginBout,
	emitUpdateReasonToPlay,
	emitUpdateReasonInPlay,
	emitUpVoteEstablishedReasonInPlay,
	emitUpVoteContestedReasonInPlay,
	emitDownVoteEstablishedReasonInPlay,
	emitDownVoteContestedReasonInPlay,
	emitMoveRIPToEstablishedGrounds,
	emitStartEndPoll,
	emitGetWinners,
} = gameSlice.actions;

export default gameSlice.reducer;
