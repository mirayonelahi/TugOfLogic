import { useState } from "react";

function EditReason(props) {
	const maxReasonLimit = 210;
	const [reasonToEdit, setReasonToEdit] = useState(props.reason.reason);
	const [displayLimit, setDisplayLimit] = useState(maxReasonLimit);

	function handleEditReasonToPlay(event) {
		setReasonToEdit(event.target.value);
		setDisplayLimit(maxReasonLimit - event.target.value.length);
	}

	function updateReason() {
		// @TODO: Add Form Validation
		if (reasonToEdit !== props.reason.reason) {
			if (props.reasonType === "rtp") {
				props.updateReasonToPlay(props.reason._id, reasonToEdit);
			} else {
				props.updateReasonInPlay(reasonToEdit);
			}
			props.closeEditReasonForm();
		}
	}

	return (
		<div className="flex flex-row mt-8">
			<div className="flex-1 p-6 rounded-lg shadow-lg ">
				<div className="flex-1 text-center">
					<legend className="block mb-2 text-center text-gray-700">
						Edit your reason ({displayLimit})
					</legend>
					<textarea
						className="mt-1 overflow-hidden form-textarea rounded-xl"
						rows={3}
						cols={50}
						value={reasonToEdit}
						onChange={handleEditReasonToPlay}
						maxLength={maxReasonLimit}
					/>
					<div className="flex gap-3 justify-center">
						<button
							className="bg-blue-300 rounded-md p-0.5 hover:bg-blue-500"
							onClick={updateReason}>
							Submit
						</button>
						<button
							className="bg-red-300 rounded-md p-0.5 hover:bg-red-500"
							onClick={props.closeEditReasonForm}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditReason;
