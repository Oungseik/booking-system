import type { Class } from "./model/classes.model";
import type { Package } from "./model/packages.model";
import type { User } from "./model/users.model";

export const classes: Record<string, Class & { uid: string }> = {
	"mm-yg": { uid: "mm-yg", place: "Myanmar/MM", credit: 5, name: "Yoga Class", duration: "1h" },
	"mm-gm": { uid: "mm-gm", place: "Myanmar/MM", credit: 10, name: "Gym Class", duration: "2h" },
	"mm-dc": { uid: "mm-dc", place: "Myanmar/MM", credit: 15, name: "Dance Class", duration: "3h" },

	"sg-yg": { uid: "sg-yg", place: "Singapore/SG", credit: 5, name: "Yoga Class", duration: "1h" },
	"sg-gm": { uid: "sg-gm", place: "Singapore/SG", credit: 10, name: "Gym Class", duration: "2h" },
	"sg-dc": { uid: "sg-dc", place: "Singapore/SG", credit: 15, name: "Dance Class", duration: "3h" },

	"my-yg": { uid: "my-yg", place: "Malaysia/MY", credit: 5, name: "Yoga Class", duration: "1h" },
	"my-gm": { uid: "my-gm", place: "Malaysia/MY", credit: 10, name: "Gym Class", duration: "2h" },
	"my-dc": { uid: "my-dc", place: "Malaysia/MY", credit: 15, name: "Dance Class", duration: "3h" },
};

export const packages: Record<string, Omit<Package, "createdAt" | "updatedAt"> & { uid: string }> =
	{
		"SG-BcP-1": {
			uid: "SG-BcP-1",
			name: "Basic Package",
			credit: 50,
			expiredDate: new Date("2024/05/01"),
			plan: "Basic",
			price: 100,
			country: "Singapore/SG",
		},
		"SG-ProP-1": {
			uid: "SG-ProP-1",
			name: "Pro Package",
			credit: 100,
			expiredDate: new Date("2024/06/01"),
			plan: "Pro",
			price: 200,
			country: "Singapore/SG",
		},
		"SG-PtP-1": {
			uid: "SG-PtP-1",
			name: "Platnium Package",
			credit: 200,
			expiredDate: new Date("2025/06/01"),
			plan: "Platinum",
			price: 400,
			country: "Singapore/SG",
		},

		"MM-BcP-1": {
			uid: "MM-BcP-1",
			name: "Basic Package",
			credit: 50,
			expiredDate: new Date("2024/05/01"),
			plan: "Basic",
			price: 100,
			country: "Myanmar/MM",
		},
		"MM-ProP-1": {
			uid: "MM-ProP-1",
			name: "Pro Package",
			credit: 100,
			expiredDate: new Date("2024/06/01"),
			plan: "Pro",
			price: 200,
			country: "Myanmar/MM",
		},
		"MM-PtP-1": {
			uid: "MM-PtP-1",
			name: "Platnium Package",
			credit: 200,
			expiredDate: new Date("2025/06/01"),
			plan: "Platinum",
			price: 400,
			country: "Myanmar/MM",
		},

		"MY-BcP-1": {
			uid: "MY-BcP-1",
			name: "Basic Package",
			credit: 50,
			expiredDate: new Date("2024/05/01"),
			plan: "Basic",
			price: 100,
			country: "Malaysia/MY",
		},
		"MY-ProP-1": {
			uid: "MY-ProP-1",
			name: "Pro Package",
			credit: 100,
			expiredDate: new Date("2024/06/01"),
			plan: "Pro",
			price: 200,
			country: "Malaysia/MY",
		},
		"MY-PtP-1": {
			uid: "MY-PtP-1",
			name: "Platnium Package",
			credit: 200,
			expiredDate: new Date("2025/06/01"),
			plan: "Platinum",
			price: 400,
			country: "Malaysia/MY",
		},
	};

export const users: Omit<User, "createdAt" | "updatedAt">[] = [
	{
		name: "Myanmar User",
		email: "john@myanmar.com",
		classes: [],
		packages: [],
		password: "$2b$10$vvVoUpR4cKdcPfF3mlZlYeF1mUVkYvr0/S8ztw/3KXIj0f2LIlQ0G",
	},

	{
		name: "Singapore User",
		email: "john@singapore.com",
		classes: [],
		packages: [],
		password: "$2b$10$vvVoUpR4cKdcPfF3mlZlYeF1mUVkYvr0/S8ztw/3KXIj0f2LIlQ0G",
	},

	{
		name: "Malaysia User",
		email: "john@malaysia.com",
		classes: [],
		packages: [],
		password: "$2b$10$vvVoUpR4cKdcPfF3mlZlYeF1mUVkYvr0/S8ztw/3KXIj0f2LIlQ0G",
	},
];
