import { Message } from "discord.js";
import { SlashCommand } from "slashasaurus";
import FindReplace from "../../pages/FindReplace";

const map = new Map<string, FindReplace>();

export default new SlashCommand(
	{
		name: "find",
		description: "Choose Your Own Adventure with autocompelete",
		options: [
			{
				type: "STRING",
				name: "in",
				description: "Text to search in",
				required: true,
			},
			{
				type: "STRING",
				name: "find",
				description: "Text to find",
				required: true,
				autocomplete: true,
				onAutocomplete: async (interaction, text) => {
					if (!map.has(interaction.user.id)) {
						// Make a new page for this user, and start the CYOA
						const page = new FindReplace(interaction.options.getString("in")!);
						await page.sendToChannel(interaction.channel!);
						map.set(interaction.user.id, page);
					}
					const page = map.get(interaction.user.id)!;
					page.setState({
						highlight: text ?? "",
					});
					interaction.respond([
						{
							name: "See above to preview found results",
							value: "lol",
						},
					]);
				},
			},
		] as const,
	},
	{
		run: async (interaction) => {
			const message = map.get(interaction.user.id)!.message as Message;
			await message.delete();
			interaction.reply({
				content: `Replaced`,
			});
		},
	}
);
