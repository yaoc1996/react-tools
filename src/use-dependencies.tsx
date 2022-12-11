import { MutableRefObject, useCallback, useEffect, useRef } from "react";

function useDependencies(deps: Array<any>) {
	const prevDepsRef = useRef() as MutableRefObject<Array<any>>;

	useEffect(() => {
		prevDepsRef.current = undefined as any;
	}, []);

	const reducer = useCallback((prev: boolean, curr: any, i: number) => {
		return prev || (prevDepsRef.current && curr !== prevDepsRef.current[i]);
	}, []);

	return [
		() =>
			!deps ||
			!prevDepsRef.current ||
			prevDepsRef.current.length !== deps.length ||
			deps.reduce(reducer, false),
		() => {
			prevDepsRef.current = deps;
		},
	] as [() => boolean, () => void];
}

export default useDependencies;
