import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setRole, emitStartGame } from "../../reducers/gameSlice";

function CreateGameModal(props) {
	const dispatch = useDispatch();

	const claimLimit = 210;
	const [mainClaim, setMainClaim] = useState(null);
	const [displayLimit, setDisplayLimit] = useState(claimLimit);

	dispatch(setRole({ role: "referee" }));

	function handleMainClaim(event) {
		setMainClaim(event.target.value);
		setDisplayLimit(claimLimit - event.target.value.length);
	}

	function createGame() {
		dispatch(
			emitStartGame({
				mainClaim: mainClaim,
			})
		);
		props.startCreatedGame();
	}

	return (
		<div className="h-full text-center bg-blue-200">
			<div className="flex flex-col">
				<h1 className="py-4 text-3xl font-bold text-gray-600">Create a Game</h1>
				<div className="flex flex-col">
					<div className="flex flex-row items-center justify-center gap-2 m-2 text-xl"></div>

					<div className="h-full text-center">
						<form>
							<span className="text-lg font-medium">Main Claim ({displayLimit})</span>
							<label className="block">
								<textarea
									className="form-textarea mt-2 ml-14 overflow-hidden block w-5/6 rounded-xl"
									rows="3"
									onChange={handleMainClaim}
									maxLength={claimLimit}
									placeholder="State your main claim"></textarea>
							</label>

							<button
								className="px-10 py-3 mt-10 text-base font-bold text-white bg-blue-500 w-52 rounded-2xl hover:shadow hover:bg-blue-800"
								onClick={createGame}>
								Start Game
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateGameModal;
