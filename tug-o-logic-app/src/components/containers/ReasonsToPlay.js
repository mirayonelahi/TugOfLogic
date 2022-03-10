import Reason from "./Reason";

function ReasonsToPlay(props) {
	return (
		<div className="flex flex-1 flex-col h-72 p-2 rounded-lg shadow-lg ">
			<h2 className="mb-2 mt-1 text-2xl font-bold text-center text-gray-800">Reasons To Play</h2>
			{props.reasons ? (
				<ul className="overflow-y-auto">
					<ol>
						{props.reasons.map(item => {
							return (
								<Reason
									role={props.role}
									playerName={props.playerName}
									key={item._id}
									reasonEditor={item.playerName}
									reason={item.reason}
									reasonId={item._id}
									discussCount={item.discuss}
									ignoreCount={item.ignore}
									didVoteDiscuss={item.didVoteDiscuss}
									didVoteIgnore={item.didVoteIgnore}
									handleVoteDiscussReason={props.handleVoteDiscussReason}
									handleVoteIgnoreReason={props.handleVoteIgnoreReason}
									handleBeginBout={props.handleBeginBout}
									openEditReasonForm={props.openEditReasonForm}
								/>
							);
						})}
					</ol>
				</ul>
			) : null}
		</div>
	);
}

export default ReasonsToPlay;
