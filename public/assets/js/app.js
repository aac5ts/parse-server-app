var myProfile;

Parse.initialize("myAppId");
Parse.serverURL = 'http://alexandra-parse-app.herokuapp.com/parse'
//Parse.serverURL = 'http://localhost:1337/parse'

var ChatMessage = Parse.Object.extend("ChatMessage");
var Profile = Parse.Object.extend("Profile");

let query = new Parse.Query('ChatMessage');
let subscription = query.subscribe();
  

$('#send-chat-button').click(function(){
    sendMessage();
});

$('#chat-input').keyup(function (e) {
    if (e.keyCode == 13) { //enter key
        sendMessage();
    }
});

$('#submit-profile-button').click(function(){
    submitProfile();
});

$('#nav-welcome').click(function(){
    $('#welcome').show();
    $('#nav-welcome').parent('li').addClass('active');

    $('#profiles').hide();
    $('#nav-profiles').parent('li').removeClass('active');

    $('#chat').hide();
    $('#nav-chat').parent('li').removeClass('active');
  });
  
 $('#nav-chat').click(function(){
    showChat();
    
  });

function submitProfile() {
  var name = $('#profile-name-input').val();
  var school = $('#profile-school-input').val();
  
  var profile = new Profile();
  profile.set("name", name);
  profile.set("school", school);
  
  profile.save(null, {
    success: function(profile) {
        console.log("saved profile to db")
        $('#profile-name-input').val('');
        $('#profile-school-input').val('');
        
        myProfile = profile;
        
        showChat();
      },
    error: function(profile, error) {
        alert("Make sure to enter a valid profile!!");
    }
  });
}

function showChat() {
  $("#chat-history-table-body").empty();
  
  if(myProfile) {
    $("#chat-panel-title").html("Hey, " + myProfile.get("name") + "! You can start chatting!");
  }
  
   fetchMessages();
   
   $("#welcome").hide();
   $("#profiles").hide();
   $("#chat").show();
   $('#nav-chat').parent('li').addClass('active');
   $('#nav-profiles').parent('li').removeClass('active');
   $('#nav-welcome').parent('li').removeClass('active');
}

function sendMessage() {
    var message = $('#chat-input').val();
    $('#chat-input').val('');
    
    if (myProfile) {
      var chatMessage = new ChatMessage();
      chatMessage.set("message", message);
      chatMessage.set("name", myProfile.get("name"));
      chatMessage.set("school", myProfile.get("school"));
      
      saveMessage(chatMessage)
    } else {
      alert("Please sumbit a profile first - I don't know who you are!")
    }
}

function saveMessage(chatMessage) {
  chatMessage.save(null, {
      success: function(chatMessage) {
        console.log("saved message to db")
      },
      error: function(chatMessage, error) {
        alert("Make sure to send a valid message!!");
      }
    });
}

function fetchMessages(){
  //create query
  var query = new Parse.Query('ChatMessage');
  query.ascending("createdAt");
  
  //execute query
  query.find({
    success: function(results) {
      displayMessages(results);
    },
    error: function(error) {
      alert("Failed to fetch messages, error: " + error.message);
    }
  });
}

function displayMessages(messages) {
  console.log("displaying messages");
  
  for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
                    
          prependMessage(message)
      } 
}

function prependMessage(chatMessage) {
  var message = chatMessage.get("message");
  var name = chatMessage.get("name");
  var school = chatMessage.get("school");
  
  var row = "<tr style='padding:10px'>";
  row += "<td width='20%'><strong>" + name + " from " + school + " says: "+ "</strong></td>";
  row += "<td width='70%'>" + message + "</td>";
  row += "</tr>";
  $('#chat-history-table-body').prepend(row);
}

//Parse Live Query
subscription.on('open', () => {
  console.log('subscription opened');
});
  
subscription.on('create', (object) => {
  var message = object.get('message');
  console.log(message);
  prependMessage(object);
});