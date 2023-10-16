import { SlashCommand } from "slashasaurus";
import { getPlayerMap } from "../../pages/Minesweeper";

export default new SlashCommand(
	{
		name: "flag",
		description: "Place a flag on a cell during a game of minesweeper",
		options: [
			{
				type: "STRING",
				name: "cell",
				description: "Cell to flag, formatted as row,column",
				required: true,
				autocomplete: true,
				onAutocomplete: async (interaction, text) => {
					const board = getPlayerMap(interaction.user.id);
					if (!board) {
						interaction.respond([
							{
								name: "You are not playing a game of minesweeper",
								value: "",
							},
						]);
						return;
					}
					// Refresh the board's autocomplete session timer
					board.startAutocompleteSession();
					if (text.includes(",")) {
						const [row, col] = text.split(",").map((x) => parseInt(x));
						board.setHighlightedCell(row, col);
					}
					interaction.respond([
						{
							name: "Type your cell below, look at the preview above to see which you're flagging",
							value: text,
						},
					]);
				},
			},
		] as const,
	},
	{
		run: async (interaction, _, options) => {
			const board = getPlayerMap(interaction.user.id);
			if (!board) {
				interaction.reply({
					content: `You are not playing a game of minesweeper`,
					ephemeral: true,
				});
				return;
			}
			const [row, col] = options.cell.split(",").map((x) => parseInt(x));
			board.flagCell(col, row);
			interaction.reply({
				content: `Flagged cell ${row},${col}`,
				ephemeral: true,
			});
		},
	}
);
