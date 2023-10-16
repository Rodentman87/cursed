import { SlashCommand } from "slashasaurus";

export default new SlashCommand(
	{
		name: "user",
		description: "User stuff",
		options: [
			{
				name: "user",
				description: "The user stuff",
				type: "USER",
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
