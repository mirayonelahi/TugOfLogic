import { useState } from "react";

function MainClaim(props) {
	const [mainClaimString, setMainClaimString] = useState(props.mainClaim);
	const [editingMainClaim, setEditingMainClaim] = useState(false);

	function switchEditing() {
		setEditingMainClaim(!editingMainClaim);
	}

	function handleEditMainClaim(event) {
		setMainClaimString(event.target.value);
	}

	function updateMainClaim() {
		props.handleUpdateMainClaim(mainClaimString);
		switchEditing();
	}

	function getConvincedPercentage() {
		if (props.convinced && props.convinced !== 0) {
			return Math.round((props.convinced / (props.convinced + props.notYetPersuaded)) * 100);
		} else {
			return 0;
		}
	}

	function getNotYetPersuadedPercentage() {
		if (props.notYetPersuaded && props.notYetPersuaded !== 0) {
			return Math.floor((props.notYetPersuaded / (props.notYetPersuaded + props.convinced)) * 100);
		} else {
			return 0;
		}
	}

	function mainClaimView() {
		return (
			<div>
				<h3 className="text-2xl font-semibold text-blue-400 ">{props.mainClaim}</h3>
				{props.role === "referee" ? (
					<div className="flex justify-center gap-2 pb-0.5">
						<svg
							onClick={switchEditing}
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 border-2 hover:bg-yellow-400 rounded-md"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						{props.phase === "endpoll" ? (
							<button
								className="bg-indigo-200 hover:bg-indigo-300 rounded-md px-2 shadow-sm"
								onClick={props.handleGetWinners}>
								Get Winners
							</button>
						) : (
							<button
								className="bg-indigo-200 hover:bg-indigo-300 rounded-md px-2 shadow-sm"
								onClick={props.handleStartEndPoll}>
								Start Final Poll
							</button>
						)}
					</div>
				) : null}
			</div>
		);
	}

	function renderPlayerControls() {
		if (props.role === "player") {
			return (
				<div className="flex justify-center gap-9 p-2">
					<button
						className={
							!props.didVoteConvinced
								? "bg-green-400 rounded-md p-1 hover:bg-green-500"
								: "bg-gray-500 rounded-md p-1 opacity-50 cursor-not-allowed"
						}
						disabled={props.didVoteConvinced}
						onClick={props.handleConvincedVote}>
						Convinced
					</button>
					<button
						className={
							!props.didVoteNotYetPersuaded
								? "bg-red-400 rounded-md p-1 hover:bg-red-500"
								: "bg-gray-500 rounded-md p-1 opacity-50 cursor-not-allowed"
						}
						disabled={props.didVoteNotYetPersuaded}
						onClick={props.handleNotYetPersuadedVote}>
						Not Yet Persuaded
					</button>
				</div>
			);
		}
	}

	function editMainClaimView() {
		return (
			<>
				<textarea
					className="rounded w-full"
					value={mainClaimString}
					onChange={handleEditMainClaim}></textarea>
				<div className="flex justify-center gap-5">
					<button className=" bg-blue-300 rounded p-1 hover:bg-blue-500" onClick={updateMainClaim}>
						Update
					</button>
					<button onClick={switchEditing} className="bg-red-300 rounded p-1 hover:bg-red-500">
						Cancel
					</button>
				</div>
			</>
		);
	}

	return (
		<div>
			{props.phase === "endpoll" ? (
				<div className="p-2 text-3xl shadow-lg border-4 rounded-md font-bold">Final Poll</div>
			) : null}
			{editingMainClaim !== true ? mainClaimView() : editMainClaimView()}
			{props.playerName ? <span>Player Name: {props.playerName}</span> : null}
			{
				<span className="px-4">
					Room Code: <span className="ring-2 bg-blue-50 select-all rounded">{props.roomCode}</span>{" "}
				</span>
			}
			<div>{renderPlayerControls()}</div>
			<div className="flex flex-col pt-1 mx-20">
				<div className="flex flex-row mb-1 items-center justify-between">
					<div className="text-left">
						<span className="text-xs font-semibold inline-block text-blue-600">
							{getConvincedPercentage()}% Convinced {props.convinced} Votes
						</span>
					</div>
					<div className="text-right">
						<span className="text-xs font-semibold inline-block text-red-600">
							{getNotYetPersuadedPercentage()}% Not Yet Persuaded {props.notYetPersuaded} Votes
						</span>
					</div>
				</div>
				<div className="h-4 w-full mb-2 text-xs flex  rounded-lg bg-red-400">
					<div
						style={{ width: `${getConvincedPercentage()}%` }}
						className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-lg bg-blue-500"></div>
				</div>
			</div>
		</div>
	);
}

export default MainClaim;
