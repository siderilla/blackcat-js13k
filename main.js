const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tuna = {
	x: canvas.width - 20,
	y: 30,
	size: 20,
	speed: 1.5,
	direction: "left"
};

let characters = [];

function spawnCharacters(level) {
	const result = [];

	//player
	result.push({
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
	});

	//enemies
	if (level < 13) {
		const numEnemies = Math.min(2 + level, 10);

		for (let i = 0; i < numEnemies; i++) {
			result.push({
				id: `enemy-${i}`,
				type: "enemy",
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: 10,
				speed: 0.1 + Math.random() * 0.02 + level * 0.02,
				color: "#f77",
				direction: "left",
				state: "walking",
				frame: 0
			});
		}
	}

	return result;
}

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

let projectiles = [];

function update() {
	// movement and basic collisions
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
		if (checkCollision(c, tuna) && c.type === "enemy") {
			console.log("Enemy has eaten the tuna!");
			resetLevel();
			return;
		}
	}

	// boss behavior
	if (level === 13) {
		if (tuna.direction === "left") {
			tuna.x -= tuna.speed;
			if (tuna.x < 20) tuna.direction = "right";
		} else {
			tuna.x += tuna.speed;
			if (tuna.x > canvas.width - 20) tuna.direction = "left";
		}

		if (Math.random() < 0.02) {
			projectiles.push({
				x: tuna.x,
				y: tuna.y + tuna.size / 2,
				radius: 3,
				speed: 2,
				color: "#e74c3c"
			});
		}

		for (let i = projectiles.length - 1; i >= 0; i--) {
			const p = projectiles[i];
			p.y += p.speed;

			if (p.y > canvas.height) {
				projectiles.splice(i, 1);
				continue;
			}

			const player = characters.find(c => c.type === "player");
			if (checkCollision(p, player)) {
				console.log("BOOM! You died");
				resetLevel();
				return;
			}
		}
	}
}


function resetLevel() {
	characters = spawnCharacters(level);

	if (level === 13) {
		tuna.x = canvas.width - 20;
		tuna.y = 30; // fissato in alto
		tuna.size = 20;
		tuna.speed = 1.5;
		tuna.direction = "left";
	} else {
		tuna.x = Math.random() * (canvas.width - 20) + 10;
		tuna.y = Math.random() * (canvas.height - 20) + 10;
		tuna.size = 12;
		tuna.speed = 0;
		tuna.direction = "static";
	}

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

	for (const p of projectiles) {
		ctx.fillStyle = p.color;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
		ctx.fill();
	}
}


function gameLoop() {
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

resetLevel();

gameLoop();
