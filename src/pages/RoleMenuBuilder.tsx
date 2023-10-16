import { ButtonStyle } from "discord.js";
import {
	createInteractable,
	DeserializeStateFn,
	Page,
	PageActionRow,
	RenderedPage,
	PageInteractableButton,
} from "slashasaurus";

interface RoleOption {
	role: string;
	text: string;
}

export default class RoleMenuBuilder extends Page<
	{
		name: string;
		initialOption: RoleOption;
	},
	{
		roles: RoleOption[];
		previewRole: RoleOption | null;
		inAutocomplete: boolean;
	}
> {
	static pageId = "role-build";

	timer: ReturnType<typeof setTimeout>;

	constructor(name: string, initialOption: RoleOption) {
		super({ name, initialOption });
		this.updatePreview = this.updatePreview.bind(this);
		this.startAutocompleteSession = this.startAutocompleteSession.bind(this);
		this.state = {
			roles: [initialOption],
			previewRole: null,
			inAutocomplete: false,
		};
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	updatePreview(role: RoleOption | null) {
		this.setState({ previewRole: role });
	}

	startAutocompleteSession() {
		if (!this.state.inAutocomplete) {
			this.setState({ inAutocomplete: true });
		}
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.setState({ inAutocomplete: false, previewRole: null });
		}, 5_000);
	}

	render(): RenderedPage {
		const { roles, previewRole, inAutocomplete } = this.state;
		let text =
			`${this.props.name}\n\nRole options:\n` +
			roles.map((r) => `<@&${r.role}>: ${r.text}`).join("\n");
		if (previewRole) text += `\n<@&${previewRole.role}>: ${previewRole.text}`;
		let components = [
			<PageActionRow>
				{roles.map((role) => (
					<PageInteractableButton
						disabled
						label={role.text}
						handler={() => null}
					/>
				))}
				{previewRole && (
					<PageInteractableButton
						disabled={true}
						style={ButtonStyle.Primary}
						label={previewRole.text}
						handler={() => null}
					/>
				)}
			</PageActionRow>,
		];
		if (inAutocomplete) {
			components.push(
				<PageActionRow>
					<PageInteractableButton
						disabled={true}
						emoji="<:blank:275482460358180865>"
						handler={() => null}
					/>
				</PageActionRow>,
				<PageActionRow>
					<PageInteractableButton
						disabled={true}
						emoji="<:blank:275482460358180865>"
						handler={() => null}
					/>
				</PageActionRow>,
				<PageActionRow>
					<PageInteractableButton
						disabled={true}
						emoji="<:blank:275482460358180865>"
						handler={() => null}
					/>
				</PageActionRow>
			);
		}
		return {
			content: text,
			components,
			allowedMentions: {
				roles: [],
			},
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
