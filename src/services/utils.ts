import * as _ from 'lodash'

// We need this dedicated function as a wrapper- otherwise we would get errors
// when we have multiple typed calls within one typescript file. The checker then does not realize that
// _.cloneDeep is type agnostic
export const cloneDeep = <T>(arg: T): T => {
	return _.cloneDeep(arg)
}

export const uuidv4 = () => {
	function randomDigit() {
		if (crypto && crypto.getRandomValues) {
			const rands = new Uint8Array(1);
			crypto.getRandomValues(rands);
			return (rands[0] % 16).toString(16);
		} else {
			return ((Math.random() * 16) | 0).toString(16);
		}
	}
	const crypto = window.crypto

	return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
}