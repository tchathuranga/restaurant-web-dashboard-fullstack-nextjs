"use client"

import { ReactNode } from "react";
import { Provider } from "react-redux";
import {store, persistor } from "@/redux/store";
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from "redux-persist";

export function Providers({children}: { children: ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}