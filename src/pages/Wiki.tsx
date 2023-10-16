import { DeserializeStateFn, Page, RenderedPage } from "slashasaurus";

interface Current {
	page: Wiki | null;
}

export const current: Current = {
	page: null,
};

export default class Wiki extends Page<
	{},
	{
		currentPage: string;
	}
> {
	static pageId = "wiki";

	constructor(initialPage: string) {
		super({});
		this.state = {
			currentPage: initialPage,
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	render(): RenderedPage {
		const { currentPage } = this.state;
		const { text } = pages.find((page) => page.id === currentPage)!;

		return {
			content: text,
		};
	}
}

export const deserializeState: DeserializeStateFn<{}, {}> = (
	serializedState
) => {
	const state = JSON.parse(serializedState);
	return {
		props: {},
		state,
	};
};

interface WikiPage {
	id: string;
	text: string;
}

const pages: WikiPage[] = [
	{
		id: "bot",
		text: "A [Discord](http://localhost:3000/wiki/discord) bot is an application that commmunicates over the [API](http://localhost:3000/wiki/api) to perform actions on a Discord server.",
	},
	{
		id: "discord",
		text: "Discord is a chat application that allows users to communicate with each other through text, voice, and video. Originally released in 2015. Discord also gives developers the ability to extend the functionality of the application through the use of [bots](http://localhost:3000/wiki/bot).",
	},
	{
		id: "api",
		text: "An API, or Application Programming Interface, is a set of functions and procedures that allow the creation of applications that access the features or data of an operating system, application, or other service.",
	},
];
