import { SlashCommand } from "slashasaurus";
import DoubleClickPage from "../../pages/DoubleClick";

export default new SlashCommand(
	{
		name: "ping",
		description: "Pings the bot to make sure everything is working",
		options: [],
	},
	{
		run: (interaction) => {
			const page = new DoubleClickPage();
			page.sendAsReply(interaction, true);
		},
	}
);
