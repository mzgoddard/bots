const {processMessage} = require('chatter');
const {normalizeResponse} = require('chatter');

class Bot {
  constructor ({createMessageHandler, verbose}) {
    this.createMessageHandler = createMessageHandler;
    // Log more?
    this.verbose = verbose;
    // Cache of message handlers.
    this.handlerCache = {};
  }

  onMessage(message) {
    console.log('onMessage', message);
    return new Promise(resolve => {
      // Get the message text and an optional array of arguments based on
      // the current message. This is especially useful when "message" is
      // an object, and not a text string.
      const messageHandlerArgs = this.getMessageHandlerArgs(message);
      // Abort if false was returned. This gives the getMessageHandlerArg
      // function the ability to pre-emptively ignore messages.
      if (messageHandlerArgs === false) {
        return resolve([false]);
      }
      const {text, args = [message]} = messageHandlerArgs;
      // Get the id to retrieve a stateful message handler from the cache.
      const id = this.getMessageHandlerCacheId(...args);
      // Get a cached message handler via its id, or call createMessageHandler
      // to create a new one.
      const messageHandler = this.getMessageHandler(id, ...args);
      return resolve([messageHandler, text, args]);
    })
    .then(([messageHandler, text, args]) => {
      console.log(messageHandler, text, args);
      // If messageHandlerArgs or getMessageHandler returned false, abort.
      if (messageHandler === false) {
        return false;
      }
      return this.processMessage(messageHandler, text, ...args)
        // Then handle the response.
        .then(response => this.handleResponse(message, response));
      // messageHandler.attach(this.out);
      // // Process text and additional args through the message handler.
      // return messageHandler.enqueue([text, ...args])
    })
    // If there was an error, handle that.
    .catch(error => this.handleError(message, error));
  }

  // Expose the processMessage function on Bot instances for convenience.
  processMessage(...args) {
    return processMessage(...args);
  }

  getMessageHandlerArgs(message) {
    return {
      text: message.text,
      args: [message],
    };
  }

  getMessageHandlerCacheId(message) {
    return message && message.id;
  }

  getMessageHandler(id, ...args) {
    if (this.handlerCache[id]) {
      return this.handlerCache[id];
    }
    const messageHandler = this.createMessageHandler(id, ...args);
    if (!messageHandler) {
      return false;
    }
    if (messageHandler.hasState) {
      this.handlerCache[id] = messageHandler;
    }
    return messageHandler;
  }

  handleResponse(message, response) {
    console.log('handleResponse', message, response);
    if (response === false) {
      return false;
    }
    const responses = normalizeResponse(response) || [];
    return Promise.all(responses.map(text => this.sendResponse(message, text)));
  }

  handleError(...args) {
    console.error(...args);
  }

  sendResponse(message, text) {
    this.out.enqueue({message: text, conversationId: message.channel});
  }
}

module.exports = {
  Bot,
  default: function createBot () {
  }
};
