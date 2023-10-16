import { ButtonInteraction, ButtonStyle } from "discord.js";
import {
	createInteractable,
	DeserializeStateFn,
	Page,
	PageActionRow,
	PageInteractableButton,
	RenderedPage,
} from "slashasaurus";

export default class DoubleClickPage extends Page<
	{},
	{
		clicked: boolean;
	}
> {
	static pageId = "dbl";

	timer: ReturnType<typeof setTimeout>;

	constructor() {
		super({});
		this.toggle = this.toggle.bind(this);
		this.state = {
			clicked: false,
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	async toggle(interaction: ButtonInteraction) {
		await interaction.deferUpdate();
		if (this.state.clicked) {
			clearTimeout(this.timer);
			this.setState({ clicked: false });
			this.latestInteraction?.followUp({
				content: "Sorry, the command is unavailable at this time.",
				ephemeral: true,
			});
		} else {
			await this.setState({ clicked: true });
			this.timer = setTimeout(async () => {
				await this.latestInteraction?.followUp({
					content: "You didn't double click the button, try again please!",
					ephemeral: true,
				});
				await this.setState({ clicked: false });
			}, 500);
		}
	}

	render(): RenderedPage {
		return {
			content: `Please double click the button below to confirm that you want to run this command.`,
			components: (
				<>
					<PageActionRow>
						<PageInteractableButton
							handler={this.toggle}
							label="Confirm"
							style={
								this.state.clicked ? ButtonStyle.Primary : ButtonStyle.Secondary
							}
						/>
					</PageActionRow>
				</>
			),
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
