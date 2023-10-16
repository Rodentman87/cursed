import { Message } from "discord.js";
import { SlashCommand } from "slashasaurus";
import Calc from "../../pages/Calc";

const map = new Map<string, Calc>();

export default new SlashCommand(
	{
		name: "calc",
		description: "Evaluate mathetmatic expressions with live preview",
		options: [
			{
				type: "STRING",
				name: "expression",
				description: "Expression to evaluate",
				required: true,
				autocomplete: true,
				onAutocomplete: async (interaction, text) => {
					if (!map.has(interaction.user.id)) {
						// Make a new page for this user, and start the CYOA
						const page = new Calc();
						await page.sendToChannel(interaction.channel!);
						map.set(interaction.user.id, page);
					}
					const page = map.get(interaction.user.id)!;
					if (text !== "") {
						page.setExpression(text);
					}
					interaction.respond([
						{
							name: "Type your expression below, look at the preview above to see the result",
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
				content: `lol`,
			});
		},
	}
);
