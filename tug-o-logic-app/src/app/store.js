import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import createSocketMiddleware from "../reducers/middleware/createSocketMiddleware";

import gameReducer from "../reducers/gameSlice";

const socketMiddleware = createSocketMiddleware();

export default configureStore({
	reducer: {
		game: gameReducer,
	},
	middleware: [...getDefaultMiddleware(), socketMiddleware],
});
