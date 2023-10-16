import { SlashCommand } from "slashasaurus";
import Minesweeper, { setPlayerMap } from "../../pages/Minesweeper";

export default new SlashCommand(
	{
		name: "minesweeper",
		description: "Start a game of minesweeper",
		options: [] as const,
	},
	{
		run: async (interaction) => {
			const page = new Minesweeper();
			setPlayerMap(interaction.user.id, page);
			page.sendAsReply(interaction, true);
		},
	}
);
