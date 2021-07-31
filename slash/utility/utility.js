const { MessageButton, version } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
module.exports = {
	name: 'utility',
	description: 'Utility functions for the bot',
	options:[
		{
			type:'SUB_COMMAND',
			name: 'ping',
			description: 'It give you pong!',
		},
		{
			type:'SUB_COMMAND',
			name: 'invite',
			description: 'Show you how to invite the bot into your server!',
		},
		{
			type:'SUB_COMMAND',
			name: 'stats',
			description: 'Show you the statistic of the bot',
		},
	],
	/**
   * @param {import('discord.js').CommandInteraction} interaction
   */
	async run(interaction) {
		try{
			await interaction.defer({ ephemeral:true });
			let button;
			let invite = '';
			const duration = moment.duration(interaction.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
			switch(interaction.options.getSubCommand()) {
			case 'ping' :
				interaction.editReply(`❤ Pong!Ping is ${interaction.client.ws.ping}`);
				break;
			case 'invite' :
				invite = interaction.client.generateInvite({ scopes:['applications.commands'] });
				button = new MessageButton({
					style: 'LINK',
					url: invite,
					label: 'Invite Link',
				});
				interaction.editReply({ content: 'Here is my invite link with slash command enabled', components:[{ type: 'ACTION_ROW', components:[button] }] });
				break;
			case 'stats':
				interaction.editReply({ content:
                    `\`\`\`asciidoc
                    = STATISTICS =
                • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
                • Uptime     :: ${duration}
                • Discord.js :: v${version}
                • Node       :: ${process.version}
                • User       :: ${interaction.client.users.cache.size.toLocaleString()}
                • Channels   :: ${interaction.client.channels.cache.size.toLocaleString()}
                • Guilds     :: ${interaction.client.guilds.cache.size.toLocaleString()}
                • Platform   :: ${process.platform} ${process.arch}\`\`\`` });
				break;
			}
		}
		catch (err) {console.error(err);}
	},
};