import { useSelector } from "react-redux";

import Home from "./components/Home/Home";
import Game from "./components/Game/Game";
import Disconnected from "./components/containers/Disconnected";

function App() {
	const roomCode = useSelector(state => state.game.roomCode);
	const connectedToSocket = useSelector(state => state.game.connectedToSocket);

	return <div>{connectedToSocket ? roomCode ? <Game /> : <Home /> : <Disconnected />}</div>;
}

export default App;
