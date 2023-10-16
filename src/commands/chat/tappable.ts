import { ChannelType } from "discord-api-types/v10";
import { ForumChannel } from "discord.js";
import { SlashCommand } from "slashasaurus";
import TappableCardPage, { pageRegistry } from "../../pages/TappableCard";

export default new SlashCommand(
	{
		name: "tappable",
		description: "Makes the thing",
		options: [
			{
				name: "channel",
				description: "The channel to send the message to",
				type: "CHANNEL",
				required: true,
				channelTypes: [ChannelType.GuildForum] as const,
			},
		] as const,
	},
	{
		run: async (interaction, _, options) => {
			const channel = options.channel as ForumChannel;
			const page = new TappableCardPage();
			await page.sendAsForumPost(channel, "Tappable Card");
			pageRegistry.set(page.message!.id, page);
			interaction.reply({ content: "Done!", ephemeral: true });
		},
	}
);
