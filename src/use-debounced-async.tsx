import { MutableRefObject, useEffect, useRef } from "react";
import useDependencies from "./use-dependencies";

function useDebouncedAsync(effect: () => any, deps: Array<any>, delay = 33) {
	const [checkDeps, saveDeps] = useDependencies(deps);

	const promiseRef = useRef(Promise.resolve()) as MutableRefObject<
		Promise<any>
	>;

	const timeoutIdRef = useRef(0) as MutableRefObject<number>;

	useEffect(() => {
		if (timeoutIdRef.current > 0) {
			clearTimeout(timeoutIdRef.current);
			timeoutIdRef.current = 0;
		}

		if (checkDeps()) {
			timeoutIdRef.current = setTimeout(() => {
				promiseRef.current = promiseRef.current.then(
					async (cleanup) => {
						if (cleanup) {
							await cleanup();
						}

						saveDeps();

						return effect();
					}
				);
			}, delay) as any;
		}
	});
}

export default useDebouncedAsync;
