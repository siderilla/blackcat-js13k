const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const colorMap = {
	b: "#000",
	y: "#ff0",
	p: "#f0f",
	r: "#f00",
	l: "#0f0",
	m: "#800",
	o: "#faa",
	g: "#009100",
	a: "#00f"
};

let catX = 50;
let catY = 40;

let velocityY = 0;
let isJumping = false;

const gravity = 0.1;
const jumpPower = -2;
const groundY = 40;

const keys = {};
window.addEventListener("keydown", e => {
	keys[e.code] = true;
});

window.addEventListener("keyup", e => {
	keys[e.code] = false;
})

let frame = 0;

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (keys["ArrowLeft"]) {
		catX -= 1;
	}
	if (keys["ArrowRight"]) {
		catX += 1;
	}
	if (keys["ArrowUp"] && !isJumping) {
		velocityY = jumpPower;
		isJumping = true;
	}
	velocityY += gravity;
	catY += velocityY;
	if (catY >= groundY) {
		catY = groundY;
		velocityY = 0;
		isJumping = false;
	}
	catX = Math.max(0, Math.min(canvas.width - 10, catX));
	drawScene(frame);
	frame++;
	requestAnimationFrame(loop);
}

function drawBackground() {
	ctx.fillStyle = "#222";
	ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawShelves() {
	shelves.forEach(drawShelf())
}

const shelves = [
	{ x: 20, y: 60, width: 40},
	{ x: 80, y: 90, width: 30}
];

function drawShelf() {
	ctx.fillStyle = "#654321";
	ctx.fillRect(shelf.x, shelf.y, shelf.width, 5);
}

function drawCat(x, y) {
	const pixel = 2;
	const sprite = [
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0]

	];
	ctx.fillStyle = "black";
	sprite.forEach((row, i) => {
		row.forEach((val, j) => {
			if (val) ctx.fillRect(x + j * pixel, y + i * pixel, pixel, pixel);
		});
	});
}

function drawSmoke(x, y, time) {
	ctx.fillStyle = "rgba(0,255,0,0.2)"; // verde trasparente
	for (let i = 0; i < 5; i++) {
		const dx = Math.sin(time / 10 + i) * 2;
		const dy = -i * 5;
		ctx.beginPath();
		ctx.arc(x + dx, y + dy, 3, 0, 2 * Math.PI);
		ctx.fill();
	}
}


function drawFire(x, y, time) {
	ctx.fillStyle = time % 20 < 10 ? "#f80" : "#ff0"; // cambia colore
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - 3, y + 10);
	ctx.lineTo(x + 3, y + 10);
	ctx.closePath();
	ctx.fill();
}


function drawCouldron() {
	ctx.fillStyle = "#333";
	ctx.beginPath();
	ctx.arc(80, 92, 20, 0, Math.PI, false); // semicerchio
	ctx.fill();

	// fumo stilizzato
	ctx.fillStyle = "green";
	ctx.beginPath();
	ctx.arc(75, 85, 3, 0, 2 * Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(85, 81, 2, 0, 2 * Math.PI);
	ctx.fill();
}

function drawScene(frame) {
	drawBackground();
	drawShelves();
	drawCat(catX, catY);
	// drawSmoke(100, 60, 1);
	drawCouldron();
	drawFire(80, 105, frame);
}

loop();