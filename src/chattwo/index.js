// Bot
const {Bot, default: createBot} = require('./src/chatter/bot');
const {SlackBot, default: createSlackBot} = require('./src/chatter/slack-bot');

// Message 
const {DelegatingMessageHandler, createDelegate} = require('chatter');
const {MatchingMessageHandler, createMatcher} = require('chatter');
const {ArgsAdjustingMessageHandler, createArgsAdjuster} = require('chatter');
const {ParsingMessageHandler, createParser} = require('chatter');
const {ConversingMessageHandler, createConversation} = require('chatter');
const {CommandMessageHandler, createCommand} = require('chatter');

// Util
const {processMessage, isMessageHandlerOrHandlers} = require('chatter');
const {parseArgs} = require('chatter');
const {isMessage, isArrayOfMessages, normalizeMessage, normalizeMessages, normalizeResponse} = require('chatter');
const {default: Queue} = require('chatter');
const {composeCreators} = require('chatter');

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
