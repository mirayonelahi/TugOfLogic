function Disconnected() {
	return (
		<div className="flex flex-col justify-center items-center  h-screen bg-green-300">
			<div
				className="
					animate-spin
					rounded-full
					h-44
					w-44
					border-t-4 border-b-4 border-purple-600
					"
			/>

			<h2 className="font-bold text-5xl my-4">404</h2>
			<p className="pb-3 text-3xl">Connecting to server...</p>
			<p className="pb-3 text-3xl">Please ensure you have an Internet Connection</p>
		</div>
	);
}

export default Disconnected;
