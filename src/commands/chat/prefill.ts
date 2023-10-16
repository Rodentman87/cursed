import { SlashCommand } from "slashasaurus";

export default new SlashCommand(
	{
		name: "prefill",
		description: "ALL THE PREFILL STUFF",
		options: [
			{
				name: "boolean",
				description: "The boolean stuff",
				type: "BOOLEAN",
				required: true,
			},
			{
				name: "string",
				description: "The string stuff",
				type: "STRING",
				required: true,
			},
			{
				name: "integer",
				description: "The integer stuff",
				type: "INTEGER",
				required: true,
			},
			{
				name: "number",
				description: "The number stuff",
				type: "NUMBER",
				required: true,
			},
			{
				name: "role",
				description: "The role stuff",
				type: "ROLE",
				required: true,
			},
			{
				name: "user",
				description: "The user stuff",
				type: "USER",
				required: true,
			},
			{
				name: "channel",
				description: "The channel stuff",
				type: "CHANNEL",
				required: true,
			},
			{
				name: "mentionable",
				description: "The mentionable stuff",
				type: "MENTIONABLE",
				required: true,
			},
			{
				name: "autocomplete",
				description: "The autocomplete stuff",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
			{
				name: "optional",
				description: "The optional stuff",
				type: "STRING",
			},
		] as const,
	},
	{
		run: async (interaction, _, __) => {
			await interaction.reply({
				content: "a",
			});
		},
		autocomplete: async (interaction, _, val) => {
			if (val === "")
				interaction.respond([
					{
						name: "a",
						value: "a",
					},
				]);
			else
				interaction.respond([
					{
						name: String(val),
						value: val,
					},
				]);
		},
	}
);
