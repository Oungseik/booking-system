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

export class NotExistError extends Error {
	readonly _tag = "NotExistError";

	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}

export class AuthenticationError extends Error {
	readonly _tag = "AuthenticationError";
	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}

export class DatabaseError extends Error {
	readonly _tag = "DatabaseError";

	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}

export class PaymentError extends Error {
	readonly _tag = "PaymentError";

	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}
