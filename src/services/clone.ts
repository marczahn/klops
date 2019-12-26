import * as _ from 'lodash'

// Otherwise you would get errors when you have multiple typed calls within one file
export const cloneDeep = <T>(arg: T): T => {
	return _.cloneDeep(arg)
}