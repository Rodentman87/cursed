import { SlashCommand } from "slashasaurus";
import Minesweeper2, { setPlayerMap } from "../../pages/Minesweeper2";

export default new SlashCommand(
	{
		name: "minesweeper2",
		description: "Start a game of minesweeper",
		options: [] as const,
	},
	{
		run: async (interaction) => {
			const page = new Minesweeper2();
			setPlayerMap("1", page);
			page.sendAsReply(interaction, true);
		},
	}
);
