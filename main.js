const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = { x: 50, y: 100, size: 10, speed: 2 };
const tuna = { x: 160, y: 120, size: 12 };
const enemies = [
	{ x: 280, y: 200, size: 10, speed: 0.5 },
	{ x: 100, y: 30, size: 10, speed: 0.2 }
]

// eventually:
// const characters = [
// 	{ type: "player", x: 50, y: 100, size: 10, speed: 2, color: "#4fc3f7" },
// 	{ type: "enemy", x: 280, y: 200, size: 10, speed: 1.5, color: "#f77" },
// 	{ type: "enemy", x: 100, y: 30, size: 10, speed: 0.5, color: "#f99" }
// ];

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

function updateEnemies() {
	for (const enemy of enemies) {
		const dx = tuna.x - enemy.x;
		const dy = tuna.y - enemy.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist > 1) {
			enemy.x += (dx / dist) * enemy.speed;
			enemy.y += (dy / dist) * enemy.speed;
		}

		if (checkCollision(enemy, tuna)) {
			console.log("The enemy has eaten the tuna!");
			resetLevel();
		}
	}
}

function update() {
	// movements
	if (keys['arrowup'] || keys['w']) player.y -= player.speed;
	if (keys['arrowdown'] || keys['s']) player.y += player.speed;
	if (keys['arrowleft'] || keys['a']) player.x -= player.speed;
	if (keys['arrowright'] || keys['d']) player.x += player.speed;

	// collecting tuna
	if (checkCollision(player, tuna)) {
		level++;
		console.log("Level up", level);
		resetLevel();
	}

	updateEnemies();
}

function resetLevel() {
	player.x = 50;
	player.y = 100;
	tuna.x = Math.random() * (canvas.width - 20) + 10;
	tuna.y = Math.random() * (canvas.height - 20) + 10;

	if (level === 4) {
		bgColor = "rgba(54, 54, 105, 1)";
	} else if (level === 7) {
		bgColor = "#002"
	}

	for (const enemy of enemies) {
		enemy.x = Math.random() * (canvas.width - 20) + 10;
		enemy.y = Math.random() * (canvas.height - 20) + 10;
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

	// blackcat
	ctx.fillStyle = "#4fc3f7";
	ctx.fillRect(player.x, player.y, player.size, player.size);

	// enemies
	for (const enemy of enemies) {
		ctx.fillStyle = "#f77";
		ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
	}
}


function gameLoop() {
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

gameLoop();
