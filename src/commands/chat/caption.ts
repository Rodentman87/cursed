import { Canvas } from "@napi-rs/canvas";
import { AttachmentBuilder, CommandInteraction } from "discord.js";
import { SlashCommand } from "slashasaurus";

interface Data {
	message: CommandInteraction | null;
	canvas: Canvas | null;
}

export const data: Data = {
	message: null,
	canvas: null,
};

export default new SlashCommand(
	{
		name: "caption",
		description: "Add a caption to an image",
		options: [
			{
				name: "description",
				description: "The image caption you want to add",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		] as const,
	},
	{
		run: async (interaction, _, __) => {
			interaction.reply({
				content: "Your image is above!",
				ephemeral: true,
			});
		},
		autocomplete: async (interaction, _, value, __, _options) => {
			if (!data.message) {
				return interaction.respond([
					{
						name: "No image uploaded",
						value: "error",
					},
				]);
			}
			await interaction.respond([
				{
					name: "Generating preview...",
					value: "loading",
				},
			]);
			const description = value as string;
			const newCanvas = new Canvas(data.canvas!.width, data.canvas!.height);
			const context = newCanvas.getContext("2d");
			context.drawImage(data.canvas!, 0, 0, newCanvas.width, newCanvas.height);
			context.font = "60px sans-serif";
			const metrics = context.measureText(description);
			const left = newCanvas.width / 2 - metrics.width / 2;
			const top = 100;
			context.fillStyle = "#000000";
			context.fillRect(left - 10, top - 10, metrics.width + 20, 100);
			context.fillStyle = "#ffffff";
			context.fillText(description, left, top + 60);
			const attachment = new AttachmentBuilder(await newCanvas.encode("png"), {
				name: "image.png",
			});
			await data.message.editReply({
				content: null,
				files: [attachment],
			});
		},
	}
);
