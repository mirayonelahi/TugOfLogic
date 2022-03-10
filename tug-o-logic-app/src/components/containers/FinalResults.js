function FinalResults(props) {
	return (
		<div className="flex justify-center shadow-lg p-4 rounded mt-2  gap-12">
			<div className="bg-green-50 shadow-lg rounded-lg p-2 border-2">
				<div className="text-xl font-semibold p-2">Not Yet Persuaded -&gt; Convinced</div>
				<div className="flex flex-col text-center">
					<ul className="text-lg font-serif">
						{props.winners && props.winners.convinced
							? props.winners.convinced.map((winner, index) => {
									return (
										<li
											className="hover:bg-green-200 focus:ring-2 hover:shadow-lg rounded-md border-2"
											key={index}>
											{winner}
										</li>
									);
							  })
							: null}
					</ul>
				</div>
			</div>
			<div className="bg-red-50 shadow-lg rounded-lg p-2 border-2">
				<div className="text-xl font-semibold p-2">Convinced -&gt; Not Yet Persuaded</div>
				<div className="flex flex-col text-center">
					<ul className="text-lg font-serif">
						{props.winners && props.winners.notYetPersuaded
							? props.winners.notYetPersuaded.map((winner, index) => {
									return (
										<li
											className="hover:bg-red-200 focus:ring-2 hover:shadow-lg rounded-md border-2"
											key={index}>
											{winner}
										</li>
									);
							  })
							: null}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default FinalResults;
