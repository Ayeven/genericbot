const { Trivia, Type, Diff, Category } = require('../../dependancies/trivia');
const { MessageEmbed, MessageSelectMenu } = require('discord.js');
const { decode } = require('html-entities');
const Enmap = require('enmap');
const trivia = new Enmap({ name: 'trvia_1', dataDir: './data/trivia', fetchAll: false, autoFetch: true });
const catChoices = [
	{ name: 'arts', value: Category.arts },
	{ name: 'board_games', value: Category.board_games },
	{ name: 'books', value: Category.books },
	{ name: 'cartoon_animation', value: Category.cartoon_animation },
	{ name: 'celebrities', value: Category.celebrities },
	{ name: 'comics', value: Category.ent_comics },
	{ name: 'films', value: Category.ent_films },
	{ name: 'general_knowledge', value: Category.general_knowledge },
	{ name: 'geography', value: Category.geography },
	{ name: 'history', value: Category.history },
	{ name: 'musical_theather', value: Category.musical_theather },
	{ name: 'musics', value: Category.musics },
	{ name: 'mythology', value: Category.mythology },
	{ name: 'politics', value: Category.politics },
	{ name: 'science_computers', value: Category.science_computers },
	{ name: 'science_gadgets', value: Category.science_gadgets },
	{ name: 'science_mathematics', value: Category.science_mathematics },
	{ name: 'science_nature', value: Category.science_nature },
	{ name: 'sports', value: Category.sports },
	{ name: 'tv', value: Category.tv },
	{ name: 'vehicles', value: Category.vehicles },
	{ name: 'video_games', value: Category.video_games },
	{ name: 'animals', value: Category.animals },
	{ name: 'anime_manga', value: Category.anime_manga },
];

const typeChoices = [
	{ name: Type.mulitple, value: Type.mulitple },
	{ name: Type.true_false, value: Type.true_false },
];

const diffChoices = [
	{ name: Diff.easy, value: Diff.easy },
	{ name: Diff.hard, value: Diff.hard },
	{ name: Diff.medium, value: Diff.medium },
];
module.exports = {
	name: 'trivia',
	description: 'Let have some trivia question',
	cooldown : 20,
	options: [
		{
			type: 'INTEGER',
			name : 'category',
			description : 'Select any of the Category',
			choices : catChoices,
		},
		{
			type: 'STRING',
			name : 'type',
			description : 'Select any of the type',
			choices : typeChoices,
		},
		{
			type: 'STRING',
			name : 'difficulty',
			description : 'Select any of the difficulty',
			choices : diffChoices,
		},
	],
	/**
   * @param {import('discord.js').CommandInteraction} interaction - Represents a Command Interaction
   */
	async run(interaction) {
		try {
			await interaction.defer();
			const category = interaction.options.get('category')?.value ?? null;
			const difficulty = interaction.options.get('difficulty')?.value ?? null;
			const type = interaction.options.get('type')?.value ?? null;
			const userId = interaction.user.id;
			const question = await Trivia.getOne({ category, difficulty, type });
			const selectAnswer = new MessageSelectMenu({
				customId: `${this.name}`,
				placeholder: 'Choose the right answer',
				minValues: 1,
				maxValues: 1,
			});

			if (question == 'Invalid Parameter'
			|| question == 'No Results'
			|| question == 'Server error (unexpected error occured)'
			|| question == 'Token Empty'
			|| question == 'Token Not Found') { return interaction.followUp(question);}

			else {
				/**
				 *@type {Array<string>}
				 */
				const answers = question.incorrect;
				answers.push(question.correct);
				answers.sort(() => Math.random() - 0.5);
				for (let n = 0; n < answers.length; n++) {
					selectAnswer.addOptions([
						{
							label: `Options : ${n + 1}`,
							description: `${decode(answers[n])}`.slice(0, 48),
							value: `${decode(answers[n])}`,
						},
					]);
				}
				const embed = new MessageEmbed({
					color: 'RANDOM',
					timestamp: new Date(),
					fields: [
						{
							name: 'Type: ',
							value: question.type,
							inline: true,
						},
						{
							name: 'Difficulty: ',
							value: question.difficulty,
							inline: true,
						},
						{
							name: 'Category: ',
							value: question.category,
							inline: true,
						},
					],
					description: `**Question:**\n\n${question.question}`,
				});
				trivia.set(`${userId}`, question.correct);
				return interaction.followUp({ embeds: [embed], components: [{ type:'ACTION_ROW', components: [selectAnswer] }] });
			}

		}
		catch (err) {console.error(err);}
	},
	/**
     * @param {import('discord.js').SelectMenuInteraction} interaction - Represents a SelectMenu Interaction.
     */
	async selectmenu(interaction) {
		await interaction.deferUpdate();
		const userId = interaction.user.id;
		const correct = await trivia.get(`${userId}`);
		if (interaction.values[0] == correct) {
			interaction.message.edit({ content:'You got correct answer, congratulation', components: [], embeds: [] });
		}
		else {
			interaction.message.edit({ content:'You got the wrong answer! Better luck next time', components: [], embeds: [] });
		}
	},
};