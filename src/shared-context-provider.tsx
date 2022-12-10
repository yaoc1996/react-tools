import React, { useCallback, useRef } from "react";
import _ from "lodash";

function SharedContextProvider({ context, initial, children }: any) {
	const initialRef = useRef(initial);

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
	
	const extendedSetState = useCallback((next : object) => {
		let initials: object;

		setState((prev: any) => {
			const state = _.isFunction(next) ? next(prev) : next;
			const keys = Object.keys(state);
			initials = keys.reduce((obj: any, key: string) => {
				obj[key] = initialRef.current[key];
				return obj;
			}, {})

			return state;
		})
		
		return () => {
			setState(initials);
		}
	}, [setState])

	const contextManager = {
		...state,
		setState: extendedSetState,
	}

	return (
		<context.Provider value={contextManager}>
			{children}
		</context.Provider>
	);
}

export default SharedContextProvider;