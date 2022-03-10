function Reason(props) {

	function getDiscussPercentage() {
		if (props.discussCount && props.discussCount !== 0) {
			return Math.round((props.discussCount / (props.discussCount + props.ignoreCount)) * 100);
		} else {
			return 0;
		}
	}

	function getIgnorePercentage() {
		if (props.ignoreCount && props.ignoreCount !== 0) {
			return Math.round((props.ignoreCount / (props.ignoreCount + props.discussCount)) * 100);
		} else {
			return 0;
		}
	} 

	return (
		<>
			<li className="py-1 px-4 border-2 border-gray-400 text-center shadow rounded-lg hover:bg-gray-200">
				<div className="flex flex-row justify-center gap-5">
					<div className="text-lg pb-2 ">{props.reason}</div>
					<div>
						{props.role === "referee" ||
						(props.role === "player" && props.playerName === props.reasonEditor) ? (
							<svg
								onClick={() => {
									props.openEditReasonForm("rtp", props.reasonId);
								}}
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
						) : null}
					</div>
				</div>
				<div className="flex justify-center">
					{props.role === "player" ? (
						<div className="flex justify-center gap-4">
							<button
								onClick={() => props.handleVoteDiscussReason(props.reasonId)}
								className={
									!props.didVoteDiscuss
										? "bg-green-400 rounded-md py-0.5 px-1 hover:bg-green-500 ring-2 ring-green-600 ring-offset-2"
										: "bg-gray-500 rounded-md py-0.5 px-1 opacity-50"
								}>
								Discuss
							</button>
							<button
								onClick={() => props.handleVoteIgnoreReason(props.reasonId)}
								className={
									!props.didVoteIgnore
										? "bg-red-400 rounded-md py-0.5 px-1 hover:bg-red-500 ring-red-700 ring-2 ring-offset-2"
										: "bg-gray-500 rounded-md py-0.5 px-1 opacity-50"
								}>
								Ignore
							</button>
						</div>
					) : null}
					{props.role === "referee" ? (
						<button
							className="bg-indigo-300 rounded-md shadow-sm hover:bg-indigo-400 px-1.5 py-0.5"
							onClick={() => props.handleBeginBout(props.reasonId)}>
							Begin Bout
						</button>
					) : null}
				</div>
				<div className="flex flex-col w-2/3 ml-52">
					<div className="flex flex-row items-center justify-between">
						<div className="text-left">
							<span className="text-xs font-semibold inline-block text-green-600">
								{getDiscussPercentage()}% Discuss {props.discussCount} Votes
							</span>
						</div>
						<div className="text-right">
							<span className="text-xs font-semibold inline-block text-red-600">
								{getIgnorePercentage()}% Ignore {props.ignoreCount} Votes
							</span>
						</div>
					</div>
					<div className="h-2.5 w-full text-xs flex  rounded-lg bg-red-400">
						<div
							style={{ width: `${getDiscussPercentage()}%` }}
							className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-lg bg-green-500"></div>
					</div>
				</div>
			</li>
		</>
	);
}

export default Reason;
