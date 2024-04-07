function info(message: any, ...optionalParams: any[]) {
	console.log(message, ...optionalParams);
}

function error(message: any, ...optionalParams: any[]) {
	console.error(message, ...optionalParams);
}

export const logger = {
	info,
	error,
};
