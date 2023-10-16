import { Message } from "discord.js";
import { SlashCommand } from "slashasaurus";

let clippymessage: Message | null = null;
let nonclippymessage: Message | null = null;

export default new SlashCommand(
	{
		name: "thing",
		description: "Do things",
		options: [
			{
				name: "thing",
				description: "The thing you want to do",
				type: "STRING",
				required: true,
				autocomplete: true,
				onAutocomplete: async (interaction, value) => {
					if (clippymessage === null) {
						// Send clippy
						clippymessage = await interaction.channel!.send({
							content:
								"https://pyxis.nymag.com/v1/imgs/2fa/b6d/93cc4b84ab3e4b3387cd6656a01ab015bc-26-clippy.rsquare.w700.jpg",
						});
					}
					let content = "";
					if (value === "") {
						content =
							"Hey there! It looks like you're trying to do a thing. Just type it here and I'll help you!";
					}
					if (value === "2+2") {
						content =
							"Hey there! It looks like you're trying to calculate 2 + 2, the answer is 4!";
					}
					if (value === "1+1") {
						content =
							"Hey there! It looks like you're trying to calculate 1 + 1, the answer is 2!";
					}
					if (content === "") {
						content =
							"Hey there! It looks like you're trying to do something useless, try doing something useful instead!";
					}

					if (nonclippymessage === null) {
						// Send non-clippy
						nonclippymessage = await interaction.channel!.send({
							content: content + "\n\n\n\n.",
						});
					} else {
						// Edit non-clippy
						await nonclippymessage.edit({
							content: content + "\n\n\n\n.",
						});
					}
					interaction.respond([
						{
							name: "response",
							value: "Thing",
						},
					]);
				},
			},
		] as const,
	},
	{
		run: async (interaction, _, __) => {
			interaction.reply({
				content: "Button!",
				ephemeral: true,
			});
		},
	}
);
