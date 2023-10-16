import { SlashCommand } from "slashasaurus";

export default new SlashCommand(
	{
		name: "role",
		description: "Role stuff",
		options: [
			{
				name: "role",
				description: "The role stuff",
				type: "ROLE",
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
