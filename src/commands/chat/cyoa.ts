import { Message } from "discord.js";
import { SlashCommand } from "slashasaurus";
import CYOA from "../../pages/CYOA";

const map = new Map<string, CYOA>();
const textMap = new Map<string, string>();

export default new SlashCommand(
	{
		name: "cyoa",
		description: "Choose Your Own Adventure with autocompelete",
		options: [
			{
				type: "STRING",
				name: "text",
				description: "Text to autocomplete",
				autocomplete: true,
				onAutocomplete: async (interaction, text) => {
					if (!map.has(interaction.user.id)) {
						// Make a new page for this user, and start the CYOA
						const page = new CYOA();
						await page.sendToChannel(interaction.channel!);
						map.set(interaction.user.id, page);
						textMap.set(interaction.user.id, text);
					}
					const page = map.get(interaction.user.id)!;
					const lastText = textMap.get(interaction.user.id)!;
					if (text !== "") {
						// Let's check for a new character
						if (text.length > lastText.length) {
							// New char
							const newChar = parseInt(text.charAt(lastText.length));
							if (!isNaN(newChar)) {
								// We have a potentially valid option, send it
								page.pickOption(newChar);
							}
						}
						textMap.set(interaction.user.id, text);
					}

					interaction.respond([
						{
							name: "Type a number to choose an option from above",
							value: "lol",
						},
					]);
				},
			},
		] as const,
	},
	{
		run: async (interaction, _, options) => {
			const message = map.get(interaction.user.id)!.message as Message;
			await message.delete();
			interaction.reply({
				content: `You said: ${options.text}`,
			});
		},
	}
);
