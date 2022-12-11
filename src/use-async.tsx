import { MutableRefObject, useEffect, useRef } from "react";
import useDependencies from "./use-dependencies";

function useAsync(effect: () => any, deps: Array<any>) {
	const [checkDeps, saveDeps] = useDependencies(deps);

	const promiseRef = useRef(Promise.resolve()) as MutableRefObject<
		Promise<any>
	>;

	useEffect(() => {
		if (checkDeps()) {
			promiseRef.current = promiseRef.current.then(async (cleanup) => {
				if (cleanup) {
					await cleanup();
				}

				saveDeps();

				return effect();
			});
		}
	});
}

export default useAsync;
