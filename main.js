const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tuna = { x: 160, y: 120, size: 12 };

const characters = [
	{
		id: "black-cat",
		type: "player",
		x: 50,
		y: 100,
		size: 10,
		speed: 2,
		color: "#4fc3f7",
		direction: "down",
		state: "idle",
		frame: 0
	},
	{
		id: "enemy1",
		type: "enemy",
		x: 200,
		y: 200,
		size: 10,
		speed: 0.1,
		color: "#f77",
		direction: "left",
		state: "walking",
		frame: 0
	}
];

const keys = {};

document.addEventListener("keydown", (e) => {
	keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
	keys[e.key.toLowerCase()] = false;
});

function checkCollision(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const distance = Math.sqrt(dx * dx + dy * dy)
	return distance < (a.size + b.size) / 2;
}

let level = 1;

let bgColor = "#4d798aff";

function update() {
	// movements
	for (const c of characters) {
		if (c.type === "player") {
			if (keys['arrowup'] || keys['w']) c.y -= c.speed;
			if (keys['arrowdown'] || keys['s']) c.y += c.speed;
			if (keys['arrowleft'] || keys['a']) c.x -= c.speed;
			if (keys['arrowright'] || keys['d']) c.x += c.speed;
		}

		if (c.type === "enemy") {
			const dx = tuna.x - c.x;
			const dy = tuna.y - c.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > 1) {
				c.x += (dx / dist) * c.speed;
				c.y += (dy / dist) * c.speed;
			}
		}

		// collecting tuna
		if (checkCollision(c, tuna) && c.type === "player") {
			level++;
			console.log("Level up", level);
			resetLevel();
			return;
		}
		if (checkCollision(c, tuna)) {
			console.log("Enemy has eaten the tuna!");
			resetLevel();
			return;
		}
	}
}

function resetLevel() {
	for (const c of characters) {
		if (c.type === "player") {
			c.x = 50;
			c.y = 100;
		}
		if (c.type === "enemy") {
			c.x = Math.random() * (canvas.width - 20) + 10;
			c.y = Math.random() * (canvas.height - 20) + 10;
		}
	}

	tuna.x = Math.random() * (canvas.width - 20) + 10;
	tuna.y = Math.random() * (canvas.height - 20) + 10;

	if (level === 4) {
		bgColor = "rgba(54, 54, 105, 1)";
	} else if (level === 7) {
		bgColor = "#002";
	}
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// bg
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// tuna
	ctx.fillStyle = "#f4e04d";
	ctx.fillRect(tuna.x - tuna.size / 2, tuna.y - tuna.size / 2, tuna.size, tuna.size);

	// characters
	for (const c of characters) {
		ctx.fillStyle = c.color;
		ctx.fillRect(c.x, c.y, c.size, c.size);
	}
}


function gameLoop() {
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

gameLoop();
