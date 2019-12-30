/*
Fields are described by 2d vectors. Example:

+---+
|   |
+---+---+---+
|   |   |   |
+---+---+---+

consists of 4 vectors (x/y) - one for each field: 0/0, 0/1, 1/1, 2/1

As you can see these vectors are relative to a start vector.

TODO - Add weights or simply add blockCount multiple times to increase their occurences
 */

import {vector} from './interfaces'

const blockVectors: vector[][] = [
	// Original blocks:
	// 1x4
	[{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}],
	// half-t left
	[{x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y: 1}, {x: 1, y: 0}],
	// half-t right
	[{x: 1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 0, y: 0}],
	// square
	[{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}],
	// T
	[{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 1}],
	// first one of the strange ones
	[{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}],
	// second one of the strange ones
	[{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}],
]

export const getRandomBlockVector = (): vector[] => {
	return blockVectors[Math.floor(Math.random() * (blockVectors.length))]
}