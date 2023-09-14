export namespace CanvasUtil {
    export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, canvasSize: {
        displayWidth: number,
        displayHeight: number
    }) {
        // Get the size the browser is displaying the canvas in device pixels.
        const {displayWidth, displayHeight} = canvasSize;

        // Check if the canvas is not the same size.
        const needResize = canvas.width != displayWidth ||
            canvas.height != displayHeight;

        if (needResize) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        return needResize;
    }

    export function onResize(entries: ResizeObserverEntry[], canvasToDisplaySizeMap: Map<Element, number[]>, devicePixelRatio: number) {
        for (const entry of entries) {
            let width: number;
            let height: number;
            let dpr = devicePixelRatio;

            if (entry.devicePixelContentBoxSize) {
                // THE ONLY CORRECT ANSWER.
                // The other paths are fallbacks
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1;
            } else if (entry.contentBoxSize) {
                width = entry.contentBoxSize[0].inlineSize;
                height = entry.contentBoxSize[0].blockSize;
            } else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }

            const displayWidth = Math.round(width * dpr);
            const displayHeight = Math.round(height * dpr);
            canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    }
}