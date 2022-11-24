import React, { useEffect } from "react";
import _ from "lodash";

function createSharedContext(initial, helpers = {}) {
	const context = React.createContext(initial);
	

	function ContextProvider(props) {
		const reducer = React.useCallback((state, next) => {
			if (_.isFunction(next)) {
				return {
					...state,
					...next(state),
				};
			} else {
				return {
					...state,
					...next,
				};
			}
		}, []);

		const [state, setState] = React.useReducer(reducer, initial);

		const contextManager = {
			state,
			setState,
			methods: Object.fromEntries(Object.entries(helpers).map(([name, method]: [string, any]) => [name, method.bind(null, state, setState)])),
		}

		return (
			<context.Provider value={contextManager}>
				{props.children}
			</context.Provider>
		);
	}
	return {
		context,
		ContextProvider,
	};
}

export { createSharedContext };