import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	voteConvinced,
	voteNotYetPersuaded,
	emitVote,
	voteDiscussReasonToPlay,
	voteIgnoreReasonToPlay,
	unvoteDiscussReasonToPlay,
	unvoteIgnoreReasonToPlay,
	upVoteEstablishedReasonInPlay,
	upVoteContestedReasonInPlay,
	downVoteEstablishedReasonInPlay,
	downVoteContestedReasonInPlay,
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
} from "../../reducers/gameSlice";
import Modal from "react-modal";

import Strawpoll from "../containers/Strawpoll";
import MainClaim from "../containers/MainClaim";
import AddReason from "../containers/AddReason";
import EditReason from "../containers/EditReason";
import ReasonsToPlay from "../containers/ReasonsToPlay";
import ReasonInPlay from "../containers/ReasonInPlay";
import EstablishedGrounds from "../containers/EstablishedGrounds";
import FinalResults from "../containers/FinalResults";

function Game() {
	const dispatch = useDispatch();
	const roomCode = useSelector(state => state.game.roomCode);
	const phase = useSelector(state => state.game.state);
	const role = useSelector(state => state.game.role);
	const playerName = useSelector(state => state.game.playerName);
	const mainClaim = useSelector(state => state.game.mainClaim);
	const convincedVoteCount = useSelector(state => state.game.convinced);
	const notYetPersuadedVoteCount = useSelector(state => state.game.notYetPersuaded);
	const didVoteConvinced = useSelector(state => state.game.didVoteConvinced);
	const didVoteNotYetPersuaded = useSelector(state => state.game.didVoteNotYetPersuaded);
	const reasonsToPlay = useSelector(state => state.game.reasonsToPlay);
	const reasonInPlay = useSelector(state => state.game.reasonInPlay);
	const establishedGrounds = useSelector(state => state.game.establishedGrounds);
	const winners = useSelector(state => state.game.winners);

	// const [toggleSidebar, setToggleSidebar] = useState(false);
	const [isEditReasonModalOpen, setIsEditReasonModalOpen] = useState(false);
	const [reasonToEdit, setReasonToEdit] = useState(null);
	const [reasonToEditType, setReasonToEditType] = useState(null);

	function handleConvincedVote() {
		dispatch(voteConvinced());
		dispatch(emitVote({ roomCode: roomCode, playerName: playerName, voteType: "convinced" }));
	}

	function handleNotYetPersuadedVote() {
		dispatch(voteNotYetPersuaded());
		dispatch(emitVote({ roomCode: roomCode, playerName: playerName, voteType: "notYetPersuaded" }));
	}

	function handleUpdateMainClaim(mainClaimString) {
		dispatch(
			emitUpdateMainClaim({
				roomCode: roomCode,
				mainClaim: mainClaimString,
			})
		);
	}

	function sendNewReasonToPlay(reasonToPlay) {
		dispatch(
			emitAddReasonToPlay({
				roomCode: roomCode,
				playerName: playerName,
				reasonToPlay: reasonToPlay,
			})
		);
	}

	function handleVoteDiscussReasonToPlay(reasonId) {
		const reason = reasonsToPlay.find(reason => reason._id === reasonId);
		const reasonToEmit = {
			roomCode: roomCode,
			reasonId: reasonId,
		};
		if (reason.didVoteIgnore) {
			dispatch(unvoteIgnoreReasonToPlay(reasonId));
			dispatch(emitUnvoteIgnoreReasonToPlay(reasonToEmit));
		}
		if (reason.didVoteDiscuss) {
			dispatch(unvoteDiscussReasonToPlay(reasonId));
			dispatch(emitUnvoteDiscussReasonToPlay(reasonToEmit));
		} else {
			dispatch(voteDiscussReasonToPlay(reasonId));
			dispatch(emitVoteDiscussReasonToPlay(reasonToEmit));
		}
	}

	function handleVoteIgnoreReasonToPlay(reasonId) {
		const reason = reasonsToPlay.find(reason => reason._id === reasonId);
		const reasonToEmit = {
			roomCode: roomCode,
			reasonId: reasonId,
		};
		if (reason.didVoteDiscuss) {
			dispatch(unvoteDiscussReasonToPlay(reasonId));
			dispatch(emitUnvoteDiscussReasonToPlay(reasonToEmit));
		}
		if (reason.didVoteIgnore) {
			dispatch(unvoteIgnoreReasonToPlay(reasonId));
			dispatch(emitUnvoteIgnoreReasonToPlay(reasonToEmit));
		} else {
			dispatch(voteIgnoreReasonToPlay(reasonId));
			dispatch(emitVoteIgnoreReasonToPlay(reasonToEmit));
		}
	}

	function handleBeginBout(reasonId) {
		dispatch(
			emitBeginBout({
				roomCode: roomCode,
				reasonId: reasonId,
			})
		);
	}

	function updateReasonToPlay(reasonId, reasonText) {
		dispatch(
			emitUpdateReasonToPlay({
				roomCode: roomCode,
				reasonId: reasonId,
				reason: reasonText,
			})
		);
	}

	function updateReasonInPlay(reasonText) {
		dispatch(
			emitUpdateReasonInPlay({
				roomCode: roomCode,
				reason: reasonText,
			})
		);
	}

	function openEditReasonForm(reasonType, reasonId) {
		let reasonToEdit;
		if (reasonType === "rip") {
			reasonToEdit = reasonInPlay;
		} else {
			reasonToEdit = reasonsToPlay.find(reason => reason._id === reasonId);
		}
		setReasonToEdit(reasonToEdit);
		setReasonToEditType(reasonType);
		setIsEditReasonModalOpen(true);
	}

	function closeEditReasonForm() {
		setIsEditReasonModalOpen(false);
	}

	function handleEstablishedReasonInPlayVote() {
		if (reasonInPlay.didVoteContested) {
			dispatch(downVoteContestedReasonInPlay());
			dispatch(emitDownVoteContestedReasonInPlay({ roomCode: roomCode }));
		}
		if (reasonInPlay.didVoteEstablished) {
			dispatch(downVoteEstablishedReasonInPlay());
			dispatch(emitDownVoteEstablishedReasonInPlay({ roomCode: roomCode }));
		} else {
			dispatch(upVoteEstablishedReasonInPlay());
			dispatch(emitUpVoteEstablishedReasonInPlay({ roomCode: roomCode }));
		}
	}

	function handleContestedReasonInPlayVote() {
		if (reasonInPlay.didVoteEstablished) {
			dispatch(downVoteEstablishedReasonInPlay());
			dispatch(emitDownVoteEstablishedReasonInPlay({ roomCode: roomCode }));
		}
		if (reasonInPlay.didVoteContested) {
			dispatch(downVoteContestedReasonInPlay());
			dispatch(emitDownVoteContestedReasonInPlay({ roomCode: roomCode }));
		} else {
			dispatch(upVoteContestedReasonInPlay());
			dispatch(emitUpVoteContestedReasonInPlay({ roomCode: roomCode }));
		}
	}

	function handleMoveRIPToEstablishedGrounds() {
		dispatch(
			emitMoveRIPToEstablishedGrounds({
				roomCode: roomCode,
			})
		);
	}

	function handleStartEndPoll() {
		dispatch(emitStartEndPoll({ roomCode: roomCode }));
	}

	function handleGetWinners() {
		dispatch(emitGetWinners({ roomCode: roomCode }));
	}

	return (
		<div className="relative flex min-h-screen">
			{/* {toggleSidebar && <SideBar roomCode={roomCode} />} */}

			<div className="flex-1  m-1">
				{/* <div className="">
					<svg
						onClick={() => {
							setToggleSidebar(!toggleSidebar);
						}}
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</div> */}

				<div className="flex-1">
					<div className="text-center bg-grey-100 border rounded-lg shadow-lg pt-0.5 mt-0.5 pb-3">
						<MainClaim
							role={role}
							phase={phase}
							roomCode={roomCode}
							mainClaim={mainClaim}
							playerName={playerName}
							didVoteConvinced={didVoteConvinced}
							didVoteNotYetPersuaded={didVoteNotYetPersuaded}
							convinced={convincedVoteCount}
							notYetPersuaded={notYetPersuadedVoteCount}
							handleUpdateMainClaim={handleUpdateMainClaim}
							handleConvincedVote={handleConvincedVote}
							handleNotYetPersuadedVote={handleNotYetPersuadedVote}
							handleStartEndPoll={handleStartEndPoll}
							handleGetWinners={handleGetWinners}
						/>
					</div>
					<div className="flex flex-row w-full">
						{reasonInPlay && phase !== "endpoll" ? (
							<>
								<ReasonInPlay
									role={role}
									reason={reasonInPlay}
									openEditReasonForm={openEditReasonForm}
									handleEstablishedReasonInPlayVote={handleEstablishedReasonInPlayVote}
									handleContestedReasonInPlayVote={handleContestedReasonInPlayVote}
									handleMoveRIPToEstablishedGrounds={handleMoveRIPToEstablishedGrounds}
								/>
								<Strawpoll
									establishedVoteCount={reasonInPlay.established}
									contestedVoteCount={reasonInPlay.contested}
								/>
							</>
						) : null}
					</div>

					<div className="flex flex-row">
						<EstablishedGrounds establishedGrounds={establishedGrounds} />
						{phase !== "endpoll" ? <AddReason sendNewReasonToPlay={sendNewReasonToPlay} /> : null}
					</div>

					{phase !== "endpoll" ? (
						<div className="flex justify-around ">
							<ReasonsToPlay
								role={role}
								playerName={playerName}
								reasons={reasonsToPlay}
								handleVoteDiscussReason={handleVoteDiscussReasonToPlay}
								handleVoteIgnoreReason={handleVoteIgnoreReasonToPlay}
								handleBeginBout={handleBeginBout}
								openEditReasonForm={openEditReasonForm}
							/>
						</div>
					) : null}
					{winners !== null ? <FinalResults winners={winners} /> : null}
				</div>
			</div>
			<Modal isOpen={isEditReasonModalOpen} onRequestClose={closeEditReasonForm}>
				<EditReason
					reason={reasonToEdit}
					reasonType={reasonToEditType}
					closeEditReasonForm={closeEditReasonForm}
					updateReasonToPlay={updateReasonToPlay}
					updateReasonInPlay={updateReasonInPlay}
				/>
			</Modal>
		</div>
	);
}

export default Game;
