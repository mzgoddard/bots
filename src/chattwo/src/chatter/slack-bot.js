const RTMIn = require('../slack/rtm-in');
const RTMOut = require('../slack/rtm-out');

const {Bot} = require('./bot');

class InMessageCompat {
  constructor (bot, rtmIn) {
    this.bot = bot;
  }

  enqueue (job) {
    console.log('InMessageCompat.enqueue', job);
    this.bot.onMessage(job);
  }
}

class SlackBot extends Bot {
  constructor ({slack, getSlack, name, icon, eventNames, postMessageDelay, ...args}) {
    super(args);

    this.slack = slack;
    this.getSlack = getSlack;
    this.name = name;
    this.icon = icon;
    this.eventNames = eventNames;
    this.postMessageDelay = postMessageDelay;

    this.in = null;
    this.out = null;
  }

  // First, ensure the bot has a "slack" object, then bind event handlers and
  // start the bot.
  login() {
    if (!this.slack) {
      this.slack = this.getSlack();
      if (!this.slack || typeof this.slack !== 'object') {
        throw new TypeError('The "getSlack" function must return an object.');
      }
    }
    const slack = this.slack;
    if (!slack.rtmClient) {
      throw new TypeError('The "slack" object is missing a required "rtmClient" property.');
    }
    // else if (!slack.rtmClient.dataStore) {
    //   throw new TypeError('The "slack" object is missing a required "rtmClient.dataStore" property.');
    // }
    // else if (!slack.webClient) {
    //   throw new TypeError('The "slack" object is missing a required "webClient" property.');
    // }
    // Bind event handlers to the slack rtm client.
    // this.bindEventHandlers(this.eventNames);

    this.in = new RTMIn(this.slack.rtmClient);
    this.in.attach(new InMessageCompat(this));
    this.out = new RTMOut(this.slack.rtmClient);

    // Start the rtm client!
    this.slack.rtmClient.start();
    // Make it chainable.
    return this;
  }

  // Return an object that defines the message text and an additional "meta"
  // argument containing a number of relevant properties, to be passed into
  // message handlers (and the getMessageHandlerCacheId and getMessageHandler
  // functions).
  //
  // This function receives a slack "message" object.
  getMessageHandlerArgs(message) {
    // Ignore bot messages.
    if (message.subtype === 'bot_message') {
      return false;
    }
    const origMessage = message;
    const channel = this.slack.rtmClient.dataStore.getChannelGroupOrDMById(message.channel);
    // Ignore non-message messages.
    if (message.type !== 'message') {
      return false;
    }
    // If the message was a "changed" message, get the underlying message.
    if (message.subtype === 'message_changed') {
      message = message.message;
    }
    // Ignore any message with a subtype or attachments.
    if (message.subtype || message.attachments) {
      return false;
    }
    const user = this.slack.rtmClient.dataStore.getUserById(message.user);
    const meta = {
      bot: this,
      slack: this.slack,
      message,
      origMessage,
      channel,
      user,
    };
    return {
      text: message.text,
      args: [meta],
    };
  }
}

module.exports = {
  SlackBot: SlackBot,
  default: function createSlackBot (...args) {
    return new SlackBot(...args);
  }
};
