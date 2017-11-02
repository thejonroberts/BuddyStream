'use strict';

console.log('connected');

const video = document.querySelector('.player');
const canvas = document.querySelector('.canvas');
// console.log('canvas', canvas);
const ctx = canvas.getContext('2d');

function getVideo() {
	// get media from user's cam
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		// .getUserMedia({ video: true, audio: true })
		.then(localMediaStream => {
			console.log('media', localMediaStream);
			// send to video html element
			video.src = window.URL.createObjectURL(localMediaStream);
			// video.play(); // should happen with 'autoplay' in html video element
		})
		.catch(err => {
			console.log('webcam denied?', err);
		});
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	// console.log(width, height); // 640 x 480
	// make canvas larger than video resolution, to avoid grainy scaling when drawing to canvas.
	canvas.width = width * 4;
	canvas.height = height * 4;

	return setInterval(() => {
		// (src, xstart, ystart(topleft), xlength, ylength)
		ctx.drawImage(video, 0, Math.floor(height * 2), width, height);
		// take pixels out - need to either take whole canvas, or just video portion, and place in same place with putImageData below
		let pixels = ctx.getImageData(0, Math.floor(height * 2), width, height);
		// add effects - greenscreen first, then apply effect
		pixels = greenScreen(pixels);
		pixels = silhouetteEffect(pixels);
		// put altered image back on canvas - has to be same coordinates from getImageData!! otherwise tiling occurs
		ctx.putImageData(pixels, 0, Math.floor(height * 2));
	}, 20);
}

// apply effect to webcam
function silhouetteEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = 0; // red
		pixels.data[i + 1] = 0; // green
		pixels.data[i + 2] = 0; // blue
	}
	return pixels;
}

// take pixels that match certain RGB value to transparent (remove from video)
function greenScreen(pixels) {
	const levels = {};

	// Select input sliders and grab values
	document.querySelectorAll('.rgb input').forEach(input => {
		levels[input.name] = input.value;
	});

	for (let i = 0; i < pixels.data.length; i = i + 4) {
		let red = pixels.data[i + 0];
		let green = pixels.data[i + 1];
		let blue = pixels.data[i + 2];
		let alpha = pixels.data[i + 3];
		// if between slider values
		if (
			red >= levels.rmin &&
			red <= levels.rmax &&
			green >= levels.gmin &&
			green <= levels.gmax &&
			blue >= levels.bmin &&
			blue <= levels.bmax
		) {
			// take it out by setting alpha to zero
			pixels.data[i + 3] = 0;
		}
	}
	// return image with out of range pixels removed
	return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
