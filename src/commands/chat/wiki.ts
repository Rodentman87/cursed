import { SlashCommand } from "slashasaurus";
import Wiki, { current } from "../../pages/Wiki";

export default new SlashCommand(
	{
		name: "wiki",
		description: "Opens the wiki",
		options: [] as const,
	},
	{
		run: async (interaction) => {
			const page = new Wiki("bot");
			current.page = page;
			page.sendAsReply(interaction);
		},
	}
);
