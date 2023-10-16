import {
	ApplicationCommandOptionChoiceData,
	ApplicationCommandOptionType,
} from "discord.js";
import { SlashCommand } from "slashasaurus";

enum LetterRepsponses {
	Wrong,
	WrongPlace,
	Correct,
}

enum WordleGameState {
	Playing,
	Won,
	Lost,
}

interface Guess {
	word: string;
	responses: LetterRepsponses[];
}

class WordleGame {
	guesses: Guess[] = [];
	wordLetterCounts: Record<string, number> = {};
	state = WordleGameState.Playing;

	constructor(public word: string) {
		word.split("").forEach((letter) => {
			this.wordLetterCounts[letter] = (this.wordLetterCounts[letter] ?? 0) + 1;
		});
	}

	canGuessWord(word: string): boolean {
		if (this.state !== WordleGameState.Playing) return false;
		if (word.length !== 5) return false;
		if (this.guesses.map((guess) => guess.word).includes(word)) return false;
		return true;
	}

	guessWord(word: string): Guess | null {
		if (word.length !== 5) return null;
		if (this.guesses.length >= 6) return null;
		const letters = word.toLowerCase().split("");
		// Assume everything is wrong
		const responses = new Array(5).fill(LetterRepsponses.Wrong);
		const accountedLetters: Record<string, number> = {};
		// Fill in correct letters
		for (let i = 0; i < 5; i++) {
			if (letters[i] === this.word[i]) {
				responses[i] = LetterRepsponses.Correct;
				accountedLetters[letters[i]] = (accountedLetters[letters[i]] ?? 0) + 1;
			}
		}
		// Fill in correct letters in wrong place, but don't double count
		for (let i = 0; i < 5; i++) {
			if (responses[i] === LetterRepsponses.Correct) continue;
			const accountedFor = accountedLetters[letters[i]] ?? 0;
			if (accountedFor < this.wordLetterCounts[letters[i]] ?? 0) {
				responses[i] = LetterRepsponses.WrongPlace;
				accountedLetters[letters[i]] = (accountedLetters[letters[i]] ?? 0) + 1;
			}
		}
		const guess = {
			word,
			responses,
		};
		this.guesses.push(guess);
		if (word.toLowerCase() === this.word) {
			this.state = WordleGameState.Won;
		} else if (this.guesses.length >= 6) {
			this.state = WordleGameState.Lost;
		}
		return guess;
	}

	getAutoCompleteResponse(): ApplicationCommandOptionChoiceData<string>[] {
		const data: ApplicationCommandOptionChoiceData<string>[] = [];
		// Add the header
		data.push({
			name: "Welcome to Wordle! Type your guess below.",
			value: "Previous Guesses",
		});
		// Add the existing guesses
		this.guesses.forEach((guess) => {
			data.push({
				name: `${guess.word} - ${guess.responses
					.map((response) => {
						switch (response) {
							case LetterRepsponses.Correct:
								return "🟩";
							case LetterRepsponses.WrongPlace:
								return "🟨";
							case LetterRepsponses.Wrong:
								return "⬛";
						}
					})
					.join("")}`,
				value: guess.word,
			});
		});
		// Add the footer if the game is over
		if (this.state !== WordleGameState.Playing) {
			data.push({
				name: "Game Over!",
				value: `The word was ${this.word}`,
			});
		}
		return data;
	}
}

const gameMap = new Map<string, WordleGame>();

export default new SlashCommand(
	{
		name: "wordle",
		description: "Play Wordle with autocomplete!",
		options: [
			{
				name: "word",
				description:
					"Type your guess here and wait for autocomplete to tell you if you're right!",
				type: ApplicationCommandOptionType.String,
				required: true,
				autocomplete: true,
			},
		],
	},
	{
		run: async (interaction) => {
			interaction.reply({
				content:
					"Please type your guess into the autocomplete without pressing enter!",
				ephemeral: true,
			});
		},
		autocomplete: async (interaction, _focusedName, focusedValue) => {
			// Check if the user has a game
			if (!gameMap.has(interaction.user.id)) {
				// If not, create one
				gameMap.set(interaction.user.id, new WordleGame("hello"));
			}
			const game = gameMap.get(interaction.user.id)!;
			// Check if they can guess the word
			if (!game.canGuessWord(focusedValue as string)) {
				// If not, just return the previous guesses
				return interaction.respond(game.getAutoCompleteResponse());
			}
			// If so, guess the word
			game.guessWord(focusedValue as string);
			return interaction.respond(game.getAutoCompleteResponse());
		},
	}
);
