import { Message } from "discord.js";
import { readFileSync } from "fs";
import { join } from "path";
import { SlashCommand } from "slashasaurus";
import FunnyAutocomplete from "../../pages/FunnyAutocomplete";

const map = new Map<string, FunnyAutocomplete>();

const json = readFileSync(join(__dirname, "../../../words.json"), "utf8");
const words = JSON.parse(json) as string[];

function getMatches(word: string) {
	return words.filter((w) => w.startsWith(word));
}

export default new SlashCommand(
	{
		name: "lol",
		description: "Funny autocompelete command",
		options: [
			{
				type: "STRING",
				name: "text",
				description: "Text to autocomplete",
				autocomplete: true,
				onAutocomplete: async (interaction, text) => {
					if (!map.has(interaction.user.id)) {
						// Make a new page for this user
						const page = new FunnyAutocomplete();
						await page.sendToChannel(interaction.channel!);
						map.set(interaction.user.id, page);
					}
					const page = map.get(interaction.user.id)!;
					const results = getMatches(text)
						.slice(0, 25)
						.map((w) =>
							text.length > 0
								? "**" + w.slice(0, text.length) + "**" + w.slice(text.length)
								: w
						);
					page.setState({
						results,
					});
					interaction.respond([
						{
							name: "lol look up",
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
