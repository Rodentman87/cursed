import { DeserializeStateFn, Page, RenderedPage } from "slashasaurus";

export default class FindReplace extends Page<
	{
		text: string;
	},
	{
		highlight: string;
	}
> {
	static pageId = "f&r";

	constructor(text: string) {
		super({ text });
		this.state = {
			highlight: "",
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	render(): RenderedPage {
		const { highlight } = this.state;
		const { text } = this.props;
		const finalText =
			highlight.length > 2
				? text.replace(new RegExp("(" + highlight + ")", "gi"), `**$1**`)
				: text;
		return {
			content: finalText + "\n\n\n\n\n.",
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
