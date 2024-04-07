export class ParseError extends Error {
	readonly _tag = "ParseError";

	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}

export class DuplicateError extends Error {
	readonly _tag = "DuplicateError";

	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}
