import "dotenv/config";
import { IntentsBitField } from "discord.js";
import path from "path";
import { SlashasaurusClient } from "slashasaurus";
import express from "express";
import { getPlayerMap } from "./pages/Minesweeper2";
import { current } from "./pages/CYOA2";
import { current as wikicurrent } from "./pages/Wiki";
import { pageRegistry } from "./pages/TappableCard";

const pageStorage: Record<
	string,
	{
		pageId: string;
		state: string;
		messageData: string;
	}
> = {};

const client = new SlashasaurusClient(
	{
		intents: [
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.GuildMessageReactions,
		],
	},
	{
		storePageState(messageId, pageId, state, messageData) {
			pageStorage[messageId] = {
				pageId,
				state,
				messageData,
			};
		},
		getPageState(messageId) {
			return pageStorage[messageId] as any;
		},
	}
);

client.on("messageReactionAdd", (reaction) => {
	if (reaction.partial) {
		reaction.fetch();
	}
	if (reaction.message.partial) {
		reaction.message.fetch();
	}
	if (!pageRegistry.has(reaction.message.id)) {
		return;
	}
	const page = pageRegistry.get(reaction.message.id)!;
	if (reaction.emoji.id === "899860531505135658") {
		page.toggle();
	}
});

client.on("messageReactionRemove", (reaction) => {
	if (reaction.partial) {
		reaction.fetch();
	}
	if (reaction.message.partial) {
		reaction.message.fetch();
	}
	if (!pageRegistry.has(reaction.message.id)) {
		return;
	}
	const page = pageRegistry.get(reaction.message.id)!;
	if (reaction.emoji.id === "899860531505135658") {
		page.toggle();
	}
});

client.once("ready", () => {
	console.log(`Client ready and logged in as ${client.user?.tag}`);
	client.registerCommandsFrom(
		path.join(__dirname, "commands"),
		true,
		process.env.TOKEN!
	);
});

client.registerPagesFrom(path.join(__dirname, "pages"));

client.login(process.env.TOKEN);

const app = express();

app.get("/", (req, res) => {
	if (req.headers["user-agent"]?.includes("Discordbot"))
		return res.status(403).send("No embed");
	const { x, y } = req.query;

	const page = getPlayerMap("1");

	if (page) {
		page.revealCell(parseInt(x as string) ?? 1, parseInt(y as string) ?? 1);
	}

	return res.send(`<html>
<head>
<script>window.close();</script>
</head>
<body>
Go back to Discord.
</body>
</html>`);
});

app.get("/cyoa/:id", (req, res) => {
	if (req.headers["user-agent"]?.includes("Discordbot"))
		return res.status(403).send("No embed");
	const { id } = req.params;

	const page = current.page;

	if (!page) return res.send("no page");

	page.pickOption(parseInt(id));

	return res.send(`<html>
<head>
<script>window.close();</script>
</head>
<body>
Go back to Discord.
</body>
</html>`);
});

app.get("/wiki/:id", (req, res) => {
	if (req.headers["user-agent"]?.includes("Discordbot"))
		return res.status(403).send("No embed");
	const { id } = req.params;

	const page = wikicurrent.page;

	if (!page) return res.send("no page");

	page.setState({
		currentPage: id,
	});

	return res.send(`<html>
<head>
<script>window.close();</script>
</head>
<body>
Go back to Discord.
</body>
</html>`);
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
