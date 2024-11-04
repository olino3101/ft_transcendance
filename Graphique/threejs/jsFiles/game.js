import * as THREE from 'three';

let dirX = -0.1;
let dirY = 0.1;
const limit = 16.5;
const playerPosX = 18;
export function ballMouvement(ball, players) {
	ball.translateX(dirX);
	ball.translateY(dirY);
	if (ball.position.y >= limit || ball.position.y <= -limit)
		dirY *= -1;
	// if (ball.position.)
}
