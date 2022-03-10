/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

function SideBar(props) {
	return (
		<>
			<div className="bg-indigo-200 w-52">
				<h1 className="p-2 text-2xl font-extrabold">Tug of Logic</h1>
				<nav>
					<a href="" className="block py-2.5 px-4 hover:bg-indigo-400">
						Select Rip
					</a>
					<a href="" className="block py-2.5 px-4 hover:bg-indigo-400">
						End Game
					</a>
					<a href="" className="block py-2.5 px-4 hover:bg-indigo-400">
						Show Stat
					</a>
				</nav>

				<h1 className="block py-2.5 px-4">Room Code: {props.roomCode}</h1>

				<h1 className="block py-2.5 px-4">Players</h1>
				<h2 className="px-6 py-1">Admin</h2>
				<h2 className="px-6 py-1">John</h2>
				<h2 className="px-6 py-1">Noah</h2>
				<h2 className="px-6 py-1">Max</h2>
				<h2 className="px-6 py-1">Jack</h2>
			</div>
		</>
	);
}

export default SideBar;
