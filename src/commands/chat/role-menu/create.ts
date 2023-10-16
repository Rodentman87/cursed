import { SlashCommand } from "slashasaurus";
import RoleMenuBuilder from "../../../pages/RoleMenuBuilder";

export const map = new Map<string, RoleMenuBuilder>();

export default new SlashCommand(
	{
		name: "create",
		description: "Create a new role menu",
		options: [
			{
				type: "STRING",
				name: "name",
				description: "The name of this role menu",
				required: true,
			},
			{
				type: "ROLE",
				name: "role",
				description: "The first role to add to the menu",
				required: true,
			},
			{
				type: "STRING",
				name: "label",
				description: "The label for the first role's button",
				required: true,
			},
		] as const,
	},
	{
		run: async (interaction, _, options) => {
			const page = new RoleMenuBuilder(options.name, {
				role: options.role.id,
				text: options.label,
			});
			map.set(interaction.user.id, page);
			page.sendAsReply(interaction);
		},
	}
);
