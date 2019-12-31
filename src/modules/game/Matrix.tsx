import React, {FC} from 'react'
import {MatrixTable} from './matrix.sc'

interface Props {
	matrix: number[][]
}

const Matrix: FC<Props> = (props: Props) => {
	let html = ''
	for (let y = 0; y < props.matrix.length; y++) {
		html += '<tr>'
		for (let x = 0; x < props.matrix[y].length; x++) {
			html += `<td style="width: 10px; height: 10px; line-height: 10px;" class=cell-${props.matrix[y][x]}>${props.matrix[y][x]}</td>`
		}
		html += '</tr>'
	}
	return (<MatrixTable dangerouslySetInnerHTML={{__html: html}}/>)
}

export default Matrix