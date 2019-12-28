import {rotateBlockClockwise} from './local'
import {block} from './interfaces'
import cases from 'jest-in-case'

interface rotateTestCase {
	name: string
	actual: block
	expected: block
}

const rotateTestCases: rotateTestCase[] = [
	{
		name: 'zero 0x0, 1 vector',
		actual: {zero: {x: 0, y: 0}, vectors: [{x: 0, y: 0}], degrees: 0},
		expected: {zero: {x: 0, y: 0}, vectors: [{x: 0, y: 0}], degrees: 90},
	},
	{
		name: 'zero 0x1, 1 vector',
		actual: {zero: {x: 1, y: 0}, vectors: [{x: 0, y: 0}], degrees: 0},
		expected: {zero: {x: 1, y: 0}, vectors: [{x: 0, y: 0}], degrees: 90},
	},
	{
		name: 'rotate multiple times',
		actual: {zero: {x: 1, y: 0}, vectors: [{x: 0, y: 0}], degrees: 270},
		expected: {zero: {x: 1, y: 0}, vectors: [{x: 0, y: 0}], degrees: 360},
	},
	{
		name: 'zero 0x0, 4 vectors in one dimension',
		actual: {zero: {x: 0, y: 0}, vectors: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}], degrees: 0},
		expected: {zero: {x: -2, y: 1}, vectors: [{x: 3, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}], degrees: 90},
	},
	{
		name: 'zero 0x0, 3 vectors in two dimensions',
		actual: {zero: {x: 0, y: 0}, vectors: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}], degrees: 0},
		expected: {zero: {x: 0, y: 0}, vectors: [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}], degrees: 90},
	},

]

cases('rotate returns a set of vectors', (opts: rotateTestCase) => {
		expect(rotateBlockClockwise(opts.actual)).toStrictEqual(opts.expected)
	},
	rotateTestCases,
)
