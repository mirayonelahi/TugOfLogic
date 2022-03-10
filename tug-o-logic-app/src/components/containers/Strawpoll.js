import { Doughnut } from "react-chartjs-2";

function Strawpoll(props) {
	const data = {
		labels: ["Established", "Contested"],
		datasets: [
			{
				label: "# of Votes",
				data: [props.establishedVoteCount, props.contestedVoteCount],
				backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
				borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
				borderWidth: 1,
			},
		],
	};
	return (
		<div className="w-2/6 rounded-lg shadow-lg pb-2">
			<h2 className="mb-1 text-2xl font-bold text-center text-gray-800">Strawpoll</h2>
			<div className="flex gap-4 justify-center ">
				<span>Established {props.establishedVoteCount}</span>
				<span>Contested {props.contestedVoteCount}</span>
			</div>

			<div>
				<Doughnut data={data} width={200} height={300} options={{ maintainAspectRatio: false }} />
			</div>
		</div>
	);
}

export default Strawpoll;
