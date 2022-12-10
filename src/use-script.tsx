import { useEffect } from "react";

function useScript(options:any) {
    const { src , async: isAsync, defer, onload } = options;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = src;
        script.async = isAsync;
        script.defer = defer;
        
        if (onload) {
            script.onload = onload;
        }
        
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        }
        
    }, [src, isAsync, defer, onload])
}

export default useScript;