
Parse.initialize("myAppId");
Parse.serverURL = 'http://alexandra-parse-app.herokuapp.com/parse'

var ChatMessage = Parse.Object.extend("ChatMessage");

let query = new Parse.Query('ChatMessage');
let subscription = query.subscribe();
  
var Chat = {};
  
fetchMessages();

Chat.sendChat = function(id, callback) {
  $(id).click(callback);
}

Chat.sendChat('#send-chat', function(e){
  var message = $('#chat-input').val();
  $('#chat-input').val('');
        
  var chatMessage = new ChatMessage();
  chatMessage.set("message", message);
        
  chatMessage.save(null, {
    success: function(gameScore) {
      //alert("yay it worked!");
    },
    error: function(gameScore, error) {
      alert("sad it failed...");
    }
  });
        
  $("<p>" + message + "</p>").prependTo('.chat-history')
});


function fetchMessages(){
  //create query
  var query = new Parse.Query('ChatMessage');
  query.descending("createdAt");
  
  //execute query
  query.find({
    success: function(results) {
      displayMessages(results);
    },
    error: function(error) {
      alert("Failed to fetch profiles, error: " + error.message);
    }
  });
}

function displayMessages(messages) {
  
  $('.chat-history').empty();
  
  if (messages.length > 0) {
      for (var i = 0; i < messages.length; i++) { 
          var message = messages[i];
          
          var row = "<p>" + message.get("message") + "</p>";

          $('.chat-history').append(row);
      }
  } else {
    $('.chat-history').append("<p>You can write the first chat!!! Lucky you : )</p>");
  }
}

//Parse Live Query
subscription.on('open', () => {
  console.log('subscription opened');
});
  
subscription.on('create', (object) => {
  var message = object.get("message");
  console.log(message);
  fetchMessages(message);
});