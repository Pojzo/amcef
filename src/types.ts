interface JWTData {
	userId: number;
	jwtTokenVersion: number;
}

enum ItemFlag {
	Active = "active",
	Finished = "finished",
	Aborted = "aborted",
}

export interface CreateItem {
	userId: number;
	listId: number;
	title: string;
	description: string;
	deadline: string;
	flag: ItemFlag;
}
