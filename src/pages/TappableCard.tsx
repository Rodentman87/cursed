import {
	ChannelSelectMenuInteraction,
	MentionableSelectMenuInteraction,
	RoleSelectMenuInteraction,
	StringSelectMenuInteraction,
	UserSelectMenuInteraction,
} from "discord.js";
import {
	createInteractable,
	DeserializeStateFn,
	Page,
	PageActionRow,
	PageChannelSelect,
	PageMentionableSelect,
	PageRoleSelect,
	PageStringSelect,
	PageUserSelect,
	RenderedPage,
} from "slashasaurus";

export const pageRegistry = new Map<string, TappableCardPage>();

export default class TappableCardPage extends Page<
	{},
	{
		tapped: boolean;
	}
> {
	static pageId = "tappable";

	timer: ReturnType<typeof setTimeout>;

	constructor() {
		super({});
		this.toggle = this.toggle.bind(this);
		this.state = {
			tapped: false,
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	async toggle() {
		this.setState({ tapped: !this.state.tapped });
	}

	async handleSelect(
		interaction:
			| StringSelectMenuInteraction
			| UserSelectMenuInteraction
			| RoleSelectMenuInteraction
			| MentionableSelectMenuInteraction
			| ChannelSelectMenuInteraction
	) {
		await interaction.reply("You selected " + interaction.values.join(", "));
	}

	render(): RenderedPage {
		return {
			content: this.state.tapped
				? "https://cdn.discordapp.com/attachments/587767755353096202/1047401099201609728/image.png"
				: "https://cdn.discordapp.com/attachments/587767755353096202/1047401065265512528/image.png",
			components: (
				<>
					<PageActionRow>
						<PageStringSelect
							handler={this.handleSelect}
							options={[
								{
									label: "Option 1",
									value: "1",
								},
								{
									label: "Option 2",
									value: "2",
								},
							]}
							placeholder="Select an option"
						/>
					</PageActionRow>
					<PageActionRow>
						<PageUserSelect
							handler={this.handleSelect}
							placeholder="Select a user"
						/>
					</PageActionRow>
					<PageActionRow>
						<PageRoleSelect
							handler={this.handleSelect}
							placeholder="Select a role"
						/>
					</PageActionRow>
					<PageActionRow>
						<PageChannelSelect
							handler={this.handleSelect}
							placeholder="Select a channel"
						/>
					</PageActionRow>
					<PageActionRow>
						<PageMentionableSelect
							handler={this.handleSelect}
							placeholder="Select a mentionable"
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
