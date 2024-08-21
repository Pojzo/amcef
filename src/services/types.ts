export interface ItemPropsBase {
	itemId: number;
	title: string;
	description: string;
	deadline: Date;
	flag: "active" | "finished" | "aborted";
}

export interface ItemPropsRaw extends ItemPropsBase {
	createdBy: number;
	listId: number;
	createdBy_user: {
		email: string;
	};
}

export interface ItemProps extends ItemPropsBase {
	isCreator?: boolean;
	creatorEmail?: string | null;
}

export interface ListPropsBase {
	listId: number;
	title: string;
}

export interface ListPropsRaw extends ListPropsBase {
	createdBy: number;
	createdBy_user: {
		email: string;
	};
	items: ItemPropsRaw[];
}

export interface ListProps extends ListPropsBase {
	isCreator: boolean;
	creatorEmail: string | null;
	items: ItemProps[];
	users?: string[];
}
