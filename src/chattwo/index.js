// Bot
const {Bot, default as createBot} = require('./src/bot');
const {SlackBot, default as createSlackBot} = require('./src/slack/slack-bot');

// Message 
const {DelegatingMessageHandler, createDelegate} = require('chatter');
const {MatchingMessageHandler, createMatcher} = require('chatter');
const {ArgsAdjustingMessageHandler, createArgsAdjuster} = require('chatter');
const {ParsingMessageHandler, createParser} = require('chatter');
const {ConversingMessageHandler, createConversation} = require('chatter');
const {CommandMessageHandler, createCommand} = require('chatter');

// Util
const {processMessage, isMessageHandlerOrHandlers} = require('./util/process-message');
const {parseArgs} = require('./util/args-parser');
const {isMessage, isArrayOfMessages, normalizeMessage, normalizeMessages, normalizeResponse} = require('./util/response');
const {default as Queue} = require('./util/queue');
const {composeCreators} = require('./message-handler/delegate');

module.exports = {
  ArgsAdjustingMessageHandler,
  Bot,
  CommandMessageHandler,
  composeCreators,
  ConversingMessageHandler,
  createArgsAdjuster,
  createBot,
  createCommand,
  createConversation,
  createDelegate,
  createMatcher,
  createParser,
  createSlackBot,
  DelegatingMessageHandler,
  isArrayOfMessages,
  isMessage,
  isMessageHandlerOrHandlers,
  MatchingMessageHandler,
  normalizeMessage,
  normalizeMessages,
  normalizeResponse,
  parseArgs,
  ParsingMessageHandler,
  processMessage,
  Queue,
  SlackBot,
};
