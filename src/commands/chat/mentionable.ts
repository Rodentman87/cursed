import { SlashCommand } from "slashasaurus";

export default new SlashCommand(
	{
		name: "mentionable",
		description: "Mentionable stuff",
		options: [
			{
				name: "mentionable",
				description: "The mentionable stuff",
				type: "MENTIONABLE",
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
