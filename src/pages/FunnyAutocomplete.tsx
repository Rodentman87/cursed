import { DeserializeStateFn, Page, RenderedPage } from "slashasaurus";

export default class FunnyAutocomplete extends Page<
	{},
	{
		results: string[];
	}
> {
	static pageId = "mmlol";

	constructor() {
		super({});
		this.state = {
			results: [],
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	render(): RenderedPage {
		return {
			content:
				this.state.results.length > 0
					? this.state.results.join("\n") + "\n\n\n\n."
					: "No results found",
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
