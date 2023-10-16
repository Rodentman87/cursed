import { SlashCommand } from "slashasaurus";

export default new SlashCommand(
	{
		name: "add",
		nameLocalizations: {
			"en-GB": "colour",
		},
		description: "thing",
		options: [] as const,
	},
	{
		run: async (interaction, _, _options) => {
			interaction.reply("a");
		},
	}
);
