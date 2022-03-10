function EstablishedGrounds(props) {
	return (
		<div className="w-4/6 h-72  p-2 overflow-y-auto rounded-lg shadow-lg">
			<div className="flex items-center justify-center h-auto p-4 bg-gray-200">
				<div className="container">
					<div className="flex justify-center">
						<div className="bg-yellow-200 shadow-xl rounded-lg w-5/6">
							<ul className="divide-y divide-gray-500 overflow-y-auto">
								{props.establishedGrounds.map(ground => {
									return (
										<li
											className="px-4 py-2 hover:bg-yellow-200 cursor-pointer font-serif text-lg bg-yellow-100"
											key={ground._id}>
											{ground.reason}
										</li>
									);
								})}
								<h2 className="mb-2 text-2xl font-bold text-center text-gray-800 bg-yellow-200">
									Established Grounds
								</h2>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EstablishedGrounds;
