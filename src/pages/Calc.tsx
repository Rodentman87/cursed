import { evaluate } from "mathjs";
import { DeserializeStateFn, Page, RenderedPage } from "slashasaurus";

export default class Calc extends Page<
	{},
	{
		result: string;
	}
> {
	static pageId = "calc";

	constructor() {
		super({});
		this.setExpression = this.setExpression.bind(this);
		this.state = {
			result: "0",
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	setExpression(expr: string) {
		try {
			const result = evaluate(expr);
			this.setState({ result: result.toString() });
		} catch (e) {
			return;
		}
	}

	render(): RenderedPage {
		const { result } = this.state;
		return {
			content: result + "\n\n\n\n\n.",
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
