import { SlashCommand } from "slashasaurus";
import { map } from "./create";

export default new SlashCommand(
	{
		name: "add",
		description: "Adds a role to your role menu",
		options: [
			{
				type: "ROLE",
				name: "role",
				description: "The first role to add to the menu",
				required: true,
			},
			{
				type: "STRING",
				name: "label",
				description: "The label for the first role's button",
				required: true,
				autocomplete: true,
				onAutocomplete: async (interaction, text) => {
					if (!map.has(interaction.user.id)) {
						interaction.respond([
							{
								name: "You haven't created a role menu yet",
								value: "Create one with `/role-menu create`",
							},
						]);
						return;
					}
					const page = map.get(interaction.user.id)!;
					page.startAutocompleteSession();
					if (text !== "") {
						page.updatePreview({
							role: interaction.options.get("role", true).value as string,
							text: text,
						});
					}
					interaction.respond([
						{
							name:
								text === ""
									? "Start typing a label, look up to see a preview"
									: text,
							value: text,
						},
					]);
				},
			},
		] as const,
	},
	{
		run: async (interaction, _, _options) => {
			interaction.reply("Adding role...");
		},
	}
);
