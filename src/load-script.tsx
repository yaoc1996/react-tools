function loadScript(options: any) {
	const { src, async: isAsync, defer, onload } = options;

	const script = document.createElement("script");
	script.src = src;
	script.async = isAsync;
	script.defer = defer;

	if (onload) {
		script.onload = onload;
	}

	document.body.appendChild(script);

	return () => {
		document.body.removeChild(script);
	};
}

export default loadScript;
