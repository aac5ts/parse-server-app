
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.beforeSave("ChatMessage", function(request, response) {
  var message = request.object.get("message")
  if(message.trim() == "") {
    response.error("You can't send a blank message...");
    console.log("validate message error");
  } else {
    console.log("validate message success")
    response.success();
  }
});

Parse.Cloud.beforeSave("Profile", function(request, response) {
  var name = request.object.get("name")
  var school = request.object.get("school")
  if(name.trim() == "" || school.trim() == "") {
    response.error("Please fill out all the fields...");
  } else {
    response.success();
  }
});