import * as THREE from 'three';

let dirX = -0.2;
let dirY = 0.2;
const limit = 16.25;
const threshold = 1;
const lPlayer = 5;

function distanceBallPlayers(ball, players) {
	const distOne = Math.sqrt(
		Math.pow(players[0].position.x - ball.position.x, 2) +
		Math.pow(players[0].position.z - ball.position.z, 2)
	)

	const distTwo = Math.sqrt(
		Math.pow(players[1].position.x - ball.position.x, 2) +
		Math.pow(players[1].position.z - ball.position.z, 2)
	)
	const oneY = players[0].position.y;
	const twoY = players[1].position.y;


	if ((distOne - threshold <= 0 && isRange(ball.position.y, oneY - lPlayer, oneY + lPlayer))
		|| (distTwo - threshold <= 0 && isRange(ball.position.y, twoY - lPlayer, twoY + lPlayer)))
		return true;
	return false;
}

export function ballMouvement(ball, players) {
	ball.translateX(dirX);
	ball.translateY(dirY);
	if (ball.position.y >= limit || ball.position.y <= -limit)
	{
		dirY *= -1.0 - getRandomValue(0, 0.1);
	}
	if (distanceBallPlayers(ball, players)) {
		dirX *= -1.0 - getRandomValue(0, 0.1);
		dirY += getRandomValue(0, 0.1);
	}
}

function getRandomValue(min, max) {
	return (Math.random() * (max - min) + min);
}

function isRange(val, min, max) {
	return val >= min && val <= max;
}
