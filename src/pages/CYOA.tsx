import { DeserializeStateFn, Page, RenderedPage } from "slashasaurus";

export default class CYOA extends Page<
	{},
	{
		currentPage: string;
	}
> {
	static pageId = "cyoa";

	constructor() {
		super({});
		this.pickOption = this.pickOption.bind(this);
		this.state = {
			currentPage: "start",
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	pickOption(option: number) {
		const { currentPage } = this.state;
		const { options } = pages.find((page) => page.id === currentPage)!;
		if (option < 1 || option > options.length) return;
		const nextPage = options[option - 1].page;

		this.setState({
			currentPage: nextPage,
		});
	}

	render(): RenderedPage {
		const { currentPage } = this.state;
		const { text, options } = pages.find((page) => page.id === currentPage)!;

		return {
			content:
				text +
				"\n\n" +
				options.map((o, i) => i + 1 + ". " + o.text).join("\n") +
				"\n\n\n\n\n.",
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

interface Option {
	text: string;
	page: string;
}

interface CYOAPage {
	id: string;
	text: string;
	options: Option[];
}

const pages: CYOAPage[] = [
	{
		id: "start",
		text: "You are in a dark room.",
		options: [
			{
				text: "Turn on the light",
				page: "light",
			},
			{
				text: "Wait",
				page: "wait",
			},
		],
	},
	{
		id: "light",
		text: "You turn on the light. In front of you, you can now see a door.",
		options: [
			{
				text: "Walk through the door",
				page: "win",
			},
		],
	},
	{
		id: "wait",
		text: "You wait for a bit, but nothing happens",
		options: [
			{
				text: "Turn on the light",
				page: "light",
			},
		],
	},
	{
		id: "win",
		text: "You walk through the door, and find yourself in your kitchen. Looks like you fell asleep in the pantry again.",
		options: [],
	},
];
