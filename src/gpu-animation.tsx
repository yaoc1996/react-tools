interface GPUAnimationOptions {
	length: number;
	loop?: boolean;
}

interface GPUAnimation {
	length: number;
	loop?: boolean;
	started: boolean;

	progress: number;
	paused: boolean;
	frameId: number;

	listeners: { [key: string]: any[] };
}

class GPUAnimation {
	constructor(options: GPUAnimationOptions) {
		this.length = options.length || 30000;
		this.loop = options.loop;
		this.started = false;

		this.listeners = {
			progress: [],
			animationStart: [],
			animationEnd: [],
			pause: [],
			unpause: [],
		};

		this.filterProgress = this.filterProgress.bind(this);
		this.setProgress = this.setProgress.bind(this);
		this.setPaused = this.setPaused.bind(this);
		this.addEventListener = this.addEventListener.bind(this);
		this.removeEventListener = this.removeEventListener.bind(this);
		this.startAnimation = this.startAnimation.bind(this);
		this.endAnimation = this.endAnimation.bind(this);
		this.animationFrame = this.animationFrame.bind(this);
	}

	filterProgress(progress: number) {
		return progress - Math.floor(progress / this.length) * this.length;
	}

	setProgress(progress: number | ((prevProgress: number) => number)) {
		if (!this.started) {
			throw new Error(
				"Call startAnimation() before using setProgress(progress)."
			);
		}

		if (typeof progress === "function") {
			progress = progress(this.progress);
		}

		progress = this.filterProgress(progress);

		if (this.progress !== progress) {
			this.progress = progress;
			this.listeners["progress"].forEach((func) => func(this.progress));
		}
	}

	setPaused(pause: boolean | ((paused: boolean) => boolean)) {
		if (!this.started) {
			throw new Error(
				"Call startAnimation() before using setPaused(pause)."
			);
		}

		if (typeof pause === "function") {
			pause = pause(this.paused);
		}

		if (pause !== this.paused) {
			if (pause) {
				if (this.frameId) {
					cancelAnimationFrame(this.frameId);
					this.frameId = 0;

					this.listeners["pause"].forEach((func) => func());
				}
			} else {
				if (!this.frameId) {
					this.frameId = requestAnimationFrame(
						this.animationFrame.bind(this, undefined)
					);

					this.listeners["unpause"].forEach((func) => func());
				}
			}

			this.paused = pause;
		}
	}

	addEventListener(name: string, callback: any) {
		const listeners = this.listeners[name];

		if (!listeners) {
			throw new Error(
				`Cannot add event listener. Valid event listeners are ${Object.values(
					this.listeners
				).join(", ")}`
			);
		}

		listeners.push(callback);
	}

	removeEventListener(name: string, callback: any) {
		const listeners = this.listeners[name];

		if (!listeners) {
			throw new Error(
				`Cannot remove event listener. Valid event listeners are ${Object.values(
					this.listeners
				).join(", ")}`
			);
		}

		const index = listeners.findIndex((cb) => cb === callback);

		if (index < 0) {
			throw new Error(
				"Cannot remove event listener. Callback does not exist."
			);
		}

		listeners.splice(index, 1);
	}

	startAnimation() {
		if (!this.started) {
			this.started = true;

			this.progress = 0;
			this.paused = false;

			this.listeners["animationStart"].forEach((func) => func());
			this.frameId = requestAnimationFrame(
				this.animationFrame.bind(this, undefined)
			);
		}
	}

	endAnimation() {
		if (this.started) {
			this.started = false;

			if (this.frameId) {
				cancelAnimationFrame(this.frameId);
			}

			this.listeners["animationEnd"].forEach((func) => func());
		}
	}

	animationFrame(prevStep: number | undefined, step: number) {
		if (!prevStep) {
			prevStep = step;
		}

		const delta = this.filterProgress(step - prevStep);
		this.frameId = 0;

		if (!this.loop && this.progress + delta > this.length) {
			this.endAnimation();
		} else {
			this.setProgress(this.progress + delta);
			this.frameId = requestAnimationFrame(
				this.animationFrame.bind(this, step)
			);
		}
	}
}

export default GPUAnimation;
