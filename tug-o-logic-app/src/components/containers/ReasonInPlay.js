function ReasonInPlay(props) {
	function triggerOpenEditReasonForm() {
		props.openEditReasonForm("rip");
	}

	function voteEstablished() {
		props.handleEstablishedReasonInPlayVote();
	}

	function voteContested() {
		props.handleContestedReasonInPlayVote();
	}

	return (
		<div className="flex w-4/6 flex-row mt-2">
			<div className="flex-1 p-1 rounded-lg shadow-lg ">
				<h2 className="mb-2 text-2xl font-bold text-center text-gray-800">Reason in Play(RIP)</h2>
				<div className="flex-1 text-center">
					<div className="p-8 m-8 bg-green-100 font-medium text-green-800 text-xl rounded-lg shadow-sm ">
						{props.reason.reason}
					</div>
					<div className="flex flex-row justify-center gap-6">
						{props.role === "player" ? (
							<>
								<button
									onClick={voteEstablished}
									className={
										!props.reason.didVoteEstablished
											? "px-4 py-2 font-bold text-white bg-blue-400 rounded-lg hover:bg-blue-500 ring-blue-700 ring-4 ring-offset-4"
											: "bg-gray-500 rounded-md p-1 opacity-50"
									}>
									Established
								</button>
								<button
									onClick={voteContested}
									className={
										!props.reason.didVoteContested
											? "px-4 py-2 font-bold text-white bg-red-400 rounded-lg hover:bg-red-500 ring-red-700 ring-4 ring-offset-4"
											: "bg-gray-500 rounded-md p-1 opacity-50"
									}>
									Contested
								</button>
							</>
						) : null}

						{props.role === "referee" ? (
							<>
								<button
									className="py-0.5 px-2 text-center bg-yellow-200 rounded-md hover:bg-yellow-300 shadow-sm"
									onClick={props.handleMoveRIPToEstablishedGrounds}>
									Move To Established Grounds
								</button>
								<svg
									onClick={triggerOpenEditReasonForm}
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 hover:bg-yellow-400 rounded-md border-2"
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
							</>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ReasonInPlay;
