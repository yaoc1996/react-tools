import { MutableRefObject, useEffect, useRef } from "react";
import useDependencies from "./use-dependencies";

function useDebouncedEffect(effect: () => any, deps: Array<any>, delay = 33) {
	const [checkDeps, saveDeps] = useDependencies(deps);

	const prevCleanupRef = useRef() as MutableRefObject<() => void>;
	const timeoutIdRef = useRef(0) as MutableRefObject<number>;

	useEffect(() => {
		if (timeoutIdRef.current > 0) {
			clearTimeout(timeoutIdRef.current);
			timeoutIdRef.current = 0;
		}

		if (checkDeps()) {
			timeoutIdRef.current = setTimeout(() => {
				if (prevCleanupRef.current) {
					prevCleanupRef.current();
				}

				saveDeps();
				prevCleanupRef.current = effect();
				timeoutIdRef.current = 0;
			}, delay) as any;
		}
	});
}

export default useDebouncedEffect;
