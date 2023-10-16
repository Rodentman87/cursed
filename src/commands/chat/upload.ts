import { createCanvas, loadImage } from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";
import { SlashCommand } from "slashasaurus";
import { fetch } from "undici";
import { data } from "./caption";

// let imagemessage: Message | null = null;

export default new SlashCommand(
	{
		name: "upload",
		description: "Uploads an image for manipulation",
		options: [
			{
				name: "image",
				description: "The image you want to caption",
				type: "ATTACHMENT",
				required: true,
			},
		] as const,
	},
	{
		run: async (interaction, _, options) => {
			const blob = await fetch(options.image.url).then((res) =>
				res.arrayBuffer()
			);
			const canvas = createCanvas(options.image.width!, options.image.height!);
			const context = canvas.getContext("2d");
			const image = await loadImage(blob);
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			const attachment = new AttachmentBuilder(await canvas.encode("png"), {
				name: "image.png",
			});
			await interaction.reply({
				content: "Here is your image, use /caption to add a caption!",
				ephemeral: true,
				files: [attachment],
			});
			data.message = interaction;
			data.canvas = canvas;
		},
	}
);
