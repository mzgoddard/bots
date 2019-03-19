import {RtmClient} from '@slack/client';
import {createSlackBot, createConversation, createCommand} from '../chattwo';
import mixinBotHelpers from '../lib/bot-helpers';
import config from '../../config';

import versionCommand from './commands/version';

const bot = createSlackBot({
  name: 'Nihon Tesuto',
  icon: 'https://dl.dropboxusercontent.com/u/294332/Bocoup/bots/robocoup_icon.png',
  getSlack() {
    return {
      rtmClient: new RtmClient(config.tokens.nihontesuto),
      // webClient: new WebClient(config.tokens.nihontesuto),
    };
  },
  createMessageHandler(id, {channel}) {
    console.log('createMessageHandler', id, channel);
    // Direct message
    if (channel.is_im) {
      // Wrapping the command in a conversation allows the bot to be aware of
      // when a command returns a "dialog".
      return createConversation([
        // Nameless command that encapsulates sub-commands and adds a "help"
        // command and a fallback message handler.
        createCommand({
          isParent: true,
          description: `Dead or alive, you're coming with me.`,
        }, [
          versionCommand,
        ]),
      ]);
    }
  },
});

// Mixin bot helpers.
mixinBotHelpers(bot);

export default bot;
