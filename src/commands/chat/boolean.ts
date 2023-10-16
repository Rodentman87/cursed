import { SlashCommand } from "slashasaurus";

export default new SlashCommand(
	{
		name: "boolean",
		description: "Boolean stuff",
		options: [
			{
				name: "boolean",
				description: "The boolean stuff",
				type: "BOOLEAN",
				required: true,
			},
		] as const,
	},
	{
		run: async (interaction, _, __) => {
			await interaction.reply({
				content: "a",
			});
		},
	}
);
