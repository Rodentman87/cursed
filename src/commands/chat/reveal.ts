import { SlashCommand } from "slashasaurus";
import { getPlayerMap } from "../../pages/Minesweeper";

export default new SlashCommand(
	{
		name: "reveal",
		description: "Reveal a cell during a game of minesweeper",
		options: [
			{
				type: "STRING",
				name: "cell",
				description: "Cell to reveal, formatted as row,column",
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
							name: "Type your cell below, look at the preview above to see which you're revealing",
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
			board.revealCell(col, row);
			interaction.reply({
				content: `Revealed cell ${row},${col}`,
				ephemeral: true,
			});
		},
	}
);
