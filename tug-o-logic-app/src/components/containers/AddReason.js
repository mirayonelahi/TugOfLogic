import { useState } from "react";

function AddReason(props) {
	const maxReasonLimit = 210;
	const [reasonToPlay, setReasonToPlay] = useState("");
	const [displayLimit, setDisplayLimit] = useState(maxReasonLimit);

	function handleSetReasonToPlay(event) {
		setReasonToPlay(event.target.value);
		setDisplayLimit(maxReasonLimit - event.target.value.length);
	}

	function addNewReasonToPlay() {
		if (reasonToPlay.length >= 2) {
			props.sendNewReasonToPlay(reasonToPlay);
		}
		setReasonToPlay("");
		setDisplayLimit(maxReasonLimit);
	}

	function clearReasonToPlay() {
		setReasonToPlay("");
	}

	return (
		<div className="flex flex-row mt-8">
			<div className="flex-1 p-6 rounded-lg shadow-lg ">
				<h2 className="mb-2 text-2xl font-bold text-center text-gray-800">
					Suggest a Reason To Play(RTP)
				</h2>
				<div className="flex-1 text-center">
					<legend className="block mb-2 text-center text-gray-700">
						Enter Reason for or against the main claim ({displayLimit})
					</legend>
					<textarea
						className=" mt-1 overflow-hidden form-textarea rounded-xl"
						rows={3}
						cols={50}
						value={reasonToPlay}
						onChange={handleSetReasonToPlay}
						maxLength={maxReasonLimit}
						placeholder="Submit your Reason for or against the Main Claim. Use only one single sentence (truth-claim) per Reason"
					/>
					<div className="flex gap-3 justify-center">
						<button
							className="bg-blue-300 rounded-md p-0.5 hover:bg-blue-500"
							onClick={addNewReasonToPlay}>
							Submit
						</button>
						<button
							onClick={clearReasonToPlay}
							className="bg-red-300 rounded-md p-0.5 hover:bg-red-500">
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddReason;
