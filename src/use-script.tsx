import { useEffect } from "react";
import loadScript from "./load-script";

function useScript(options: any) {
	const { src, async: isAsync, defer, onload } = options;

	useEffect(() => {
		return loadScript({
			src,
			defer,
			onload,
			async: isAsync,
		});
	}, [src, isAsync, defer, onload]);
}

export default useScript;
