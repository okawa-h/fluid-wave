const VERTEX_LENGTH = 30;
const WAVE_SMOOTHNESS = 50;
let frameList = [];

class Utils {
	static getRangeNumber(max, min) {
		return Math.random() * (max - min) + min;
	}
}

class FluidWaveFrame {
	constructor(container) {
		this.fluidWave = null;
		this.container = container;
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.container.appendChild(this.canvas);

		this.isBottom = this.container.dataset.waveBottom === 'true';

		this.setCanvasSize();
		this.setup();
	}

	setup() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		this.fluidWave = new FluidWave(width, height, VERTEX_LENGTH, WAVE_SMOOTHNESS, this.isBottom);
	}

	renderer(elapsedTime) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.fluidWave.draw(this.context, elapsedTime);
	}

	onResize() {
		this.setCanvasSize();
		this.fluidWave.update(this.canvas.width, this.canvas.width.height)
	}

	setCanvasSize() {
		this.canvas.width = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
	}
}

class FluidWave {
	constructor(width, height, pointLength, smoothness, isBottom) {
		this.width = width;
		this.height = height;
		this.pointLength = pointLength;
		this.smoothness = smoothness;
		this.isBottom = isBottom;
		this.amplitude = this.height * Utils.getRangeNumber(0.7, 0.3);
	}

	draw(context, elapsedTime) {
		context.beginPath();
		if (this.isBottom) {
			context.moveTo(0, 0);
		} else {
			context.moveTo(0, this.height);
		}

		for (let i = 0; i < this.pointLength; i++) {
			const x = i / (this.pointLength - 1) * this.width;
			const px = i / this.smoothness;
			const py = elapsedTime;
			const y = this.amplitude * noise.perlin2(px, py) + (this.height * 0.5);
			context.lineTo(x, y);
		}
		if (this.isBottom) {
			context.lineTo(this.width, 0);
		} else {
			context.lineTo(this.width, this.height);
		}
		context.fillStyle = '#34044a';
		context.fill();
	}

	update(width, height) {
		this.width = width;
		this.height = height;
		this.amplitude = this.height * Utils.getRangeNumber(0.7, 0.3);
	}
}

const onInit = event => {
	const frames = document.querySelectorAll('[data-js="fluidWaveFrame"]');
	for (let i = 0; i < frames.length; i++) {
			frameList[i] = new FluidWaveFrame(frames[i])
	}
	renderer();
	window.addEventListener('resize', onResize);
}

const onResize = event => {
	for (let i = 0; i < frameList.length; i++) {
		frameList[i].onResize();
	}
}

const renderer = () => {
	const time = Date.now() / 4000;
	for (let i = 0; i < frameList.length; i++) {
		frameList[i].renderer(time);
	}

	window.requestAnimationFrame(renderer);
}

document.addEventListener('DOMContentLoaded', onInit);
