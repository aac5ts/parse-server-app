
//If you change your app Id, update it here
Parse.initialize("myAppId");
//Fill in your server URL here
Parse.serverURL = ''

var ChatMessage = Parse.Object.extend("ChatMessage");
var Profile = Parse.Object.extend("Profile");

let query = new Parse.Query('ChatMessage');
let subscription = query.subscribe();

let queryProfile = new Parse.Query('Profile');
let subscriptionProfile = query.subscribe();

if(doesProfileExist()) {
  showChat();
} else {
  hideClearProfileButton();
}

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

$("#clear-profile-button").click(function(){
   sessionStorage.removeItem("profileName");
   sessionStorage.removeItem("profileSchool");
   hideClearProfileButton();
   $("#chat-panel-title").html("Hey, you! Make sure to enter a profile to start chatting!");
});

$('#nav-welcome').click(function(){
    $('#welcome').show();
    $('#nav-welcome').parent('li').addClass('active');

    $('#chat').hide();
    $('#nav-chat').parent('li').removeClass('active');
  });
  
 $('#nav-chat').click(function(){
    showChat();
    
  });
  
function showClearProfileButton() {
  $("#clear-profile-button").show();
}

function hideClearProfileButton() {
  $("#clear-profile-button").hide();
}

function doesProfileExist() {
  if (sessionStorage.profileName) {
    return true;
  }
  return false;
}

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
        
        sessionStorage.setItem("profileName", name);
        sessionStorage.setItem("profileSchool", school);
        
        showChat();
        showClearProfileButton();
      },
    error: function(profile, error) {
        alert("Make sure to enter a valid profile!!");
    }
  });
}

function showChat() {
  $("#chat-history-table-body").empty();
  
  if(doesProfileExist()) {
    var name = sessionStorage.getItem("profileName");
    var school = sessionStorage.getItem("profileSchool");
    
    $("#chat-panel-title").html("Hey, " + name + "! You can start chatting!");
    console.log("Current Profile: " + name + " from " + school);
  }
  
  fetchMessages();
   
  $("#welcome").hide();
  $("#chat").show();
  $('#nav-chat').parent('li').addClass('active');
  $('#nav-welcome').parent('li').removeClass('active');
}

function sendMessage() {
    var message = $('#chat-input').val();
    $('#chat-input').val('');
    
    if (doesProfileExist()) {
      var name = sessionStorage.getItem("profileName");
      var school = sessionStorage.getItem("profileSchool");
      
      var chatMessage = new ChatMessage();
      chatMessage.set("message", message);
      chatMessage.set("name", name);
      chatMessage.set("school", school);
      
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

subscriptionProfile.on('open', () => {
  console.log('Subscription Profile opened');
});
  
subscriptionProfile.on('create', (object) => {
  console.log("Profile created");
});

subscriptionProfile.on('close', (object) => {
  console.log('Subscription Profile closed');
});

subscription.on('delete', (object) => {
  console.log('Profile deleted');
});