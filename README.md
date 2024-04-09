# Booking System

include
 - [Project Structure](#project-structure)
 - [Design Approach](#design-approach)

## project Structure

There is two important folder, `src` which is the source code and `rest` api testing files for `vscode-rest` extension.

- `src`
    - `middleware` - collection of middlewares
    - `model` - collection of mongoose model, also include **error-safe** wrapper functions for CRUD operations.
    - `routers` - collection of express routers
    - `lib` - collection of utility
        - `errors.ts` - custom define errors to create error-safe api
        - `logger.ts` - centralize logger to be easier to replace with logger service in the long run.
        - `mock.ts` - mock APIs, such as payment...
        - `parsers.ts` - collection of validation functions. Yes, it parse, inspired from [Parse, Don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
        - `schemas.ts` - zod schemas to validate user inputs.

--- 
## Design Approach

One of the most notable package is [effect](https://effect.website/), which unlock the type safty in error handling.

I carefully implement the features in the mind of data-flow. 
The data is wrapped inside the type `Effect`, which is similar to `Either` in Haskell or `Result<T, E>` in rust with extra information.

For example, in [packages.router.ts](./src/routers/packages.router.ts).

```ts
const task = pipe(
    req.params.packageId,
    getPackage(packages),
    Effect.tap((pkg) => paymentCharge({ price: pkg.price })),
    Effect.flatMap(createPackage),
    Effect.flatMap((pkg) => updateOneByEmail(req.email, { $push: { packages: pkg.id! } }, populate))
);
```

1. When the user subscribe a package, the user going to send the id of the package.
2. Then we query the currently available packages.
3. Then make the payment
4. Then store the subscribed package to the db.
5. Update the user that he/she subscribed the package. (update the relation)

When run the task, the output will be, the user who successfully subscribed the package or some *expected errors* (subscribe not exist package, payment fail or error while updating database.)

```ts
const main = Effect.match(task, {
    onSuccess: (user) => {
        res.json({ status: "success", user });
    },
    onFailure: (e) => {
        switch (e._tag) {
            case "NotExistError":
                 res.status(404).json({ message: e.message });
                 break;
            case "PaymentError":
            case "DatabaseError":
                 res.status(500).json({ message: e.message });
                 break;
        }
    },
});
```
We can easily response the user with appropriate response.

