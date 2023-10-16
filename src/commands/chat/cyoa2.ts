import { SlashCommand } from "slashasaurus";
import CYOA2, { current } from "../../pages/CYOA2";

export default new SlashCommand(
	{
		name: "cyoa2",
		description: "Choose Your Own Adventure",
		options: [] as const,
	},
	{
		run: async (interaction) => {
			const page = new CYOA2();
			current.page = page;
			page.sendAsReply(interaction);
		},
	}
);
