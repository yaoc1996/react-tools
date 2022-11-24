import React from "react";
import _ from "lodash";

function SharedContextProvider({ context, initial, children }: any) {
	const reducer = React.useCallback((state:any, next: any) => {
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
		...state,
		setState,
	}

	return (
		<context.Provider value={contextManager}>
			{children}
		</context.Provider>
	);
}

export default SharedContextProvider;