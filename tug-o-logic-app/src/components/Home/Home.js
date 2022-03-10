import { useState } from "react";
import Modal from "react-modal";

import CreateGameModal from "../modals/CreateGameModal";
import JoinGameModal from "../modals/JoinGameModal";

Modal.setAppElement("#root");

function Home() {
	const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
	const [joinModalIsOpen, setJoinModalIsOpen] = useState(false);

	function openCreateGameModal() {
		setCreateModalIsOpen(true);
	}

	function closeCreateGameModal() {
		setCreateModalIsOpen(false);
	}

	function startCreatedGame() {
		closeCreateGameModal();
	}

	function openJoinGameModal() {
		setJoinModalIsOpen(true);
	}

	function closeJoinGameModal() {
		setJoinModalIsOpen(false);
	}

	function joinCreatedGame() {
		closeJoinGameModal();
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen mx-auto bg-blue-200 gap-14">
			<button
				onClick={openCreateGameModal}
				className="w-52 px-10 py-3 text-base text-xl font-bold text-white bg-blue-500 rounded-2xl hover:shadow hover:bg-blue-800">
				Create Game
			</button>
			<Modal
				isOpen={createModalIsOpen}
				onRequestClose={closeCreateGameModal}
				contentLabel="Create Game Modal"
				className="mx-auto my-44 relative w-1/2 h-3/5 rounded-2xl overflow-hidden ">
				<CreateGameModal
					closeCreateGameModal={closeCreateGameModal}
					startCreatedGame={startCreatedGame}
				/>
			</Modal>
			<button
				onClick={openJoinGameModal}
				className="w-52 px-10 py-3 text-base text-xl font-bold text-white bg-blue-500 rounded-2xl hover:shadow hover:bg-blue-800">
				Join Game
			</button>
			<Modal
				isOpen={joinModalIsOpen}
				onRequestClose={closeJoinGameModal}
				contentLabel="Join Game Modal"
				className="mx-auto my-44 relative w-1/2 h-3/5 rounded-2xl overflow-hidden ">
				<JoinGameModal closeJoinGameModal={closeJoinGameModal} joinCreatedGame={joinCreatedGame} />
			</Modal>
		</div>
	);
}

export default Home;
