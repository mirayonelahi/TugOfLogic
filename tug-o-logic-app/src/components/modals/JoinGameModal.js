import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRole, setPlayerName, emitJoinGame } from "../../reducers/gameSlice";
import { getName } from "../../utilities/nameGenerator";

function JoinGameModal(props) {
	const dispatch = useDispatch();
	const playerName = useSelector(state => state.game.playerName);

	const [room, setRoom] = useState(null);

	dispatch(setRole({ role: "player" }));

	if (playerName === null || playerName === undefined) {
		dispatch(setPlayerName({ playerName: getName() }));
	}

	function handleRoomCode(event) {
		setRoom(event.target.value);
	}

	function handlePlayerNameChange(event) {
		dispatch(setPlayerName({ playerName: event.target.value }));
	}

	function getNewPlayerName() {
		dispatch(setPlayerName({ playerName: getName() }));
	}

	function joinGameRoom() {
		dispatch(emitJoinGame({ roomCode: room }));
		props.joinCreatedGame();
	}

	return (
		<div className="h-full text-center bg-blue-200 pt-14">
			<h1 className="p-4 text-3xl font-medium">Join Game</h1>
			<div className="flex flex-col items-center gap-4">
				<input
					className="py-2 px-2 border rounded "
					type="text"
					placeholder="Room Code"
					name="room-code"
					onChange={handleRoomCode}></input>
				<label>Player Name:</label>
				<input
					className="rounded border py-2 px-2"
					type="text"
					placeholder={"Insert your name here"}
					value={playerName}
					onChange={handlePlayerNameChange}></input>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					onClick={getNewPlayerName}
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
						clipRule="evenodd"
					/>
				</svg>
			</div>

			<div className="mt-4">
				<button
					className="content-center bg-green-400 hover:bg-green-600 text-gray-600 text-xl font-bold p-2 rounded-xl"
					onClick={joinGameRoom}>
					Join
				</button>
			</div>
		</div>
	);
}

export default JoinGameModal;
