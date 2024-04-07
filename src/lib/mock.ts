import { Effect } from "effect";

import { PaymentError } from "./errors";

type PaymentChargeParams = {
	price: number;
};

export const paymentCharge = ({
	price,
}: PaymentChargeParams): Effect.Effect<null, PaymentError, never> =>
	price <= 200
		? Effect.succeed(null)
		: Effect.fail(new PaymentError("Payment failed: not enough credit"));
