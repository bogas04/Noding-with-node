var settings = {
  startTime : new Date().getTime() - 1000*60*60*24*14,
  pageSize : 10
};
var months = {
  0 : "Jan", 1 : "Feb", 2 : "Mar", 
  3 : "Apr", 4 : "May", 5 : "Jun", 
  6 : "Jul", 7 : "Aug", 8 : "Sept", 
  9 : "Oct", 10 : "Nov", 11 : "Dec"
};
function renderPost(data) {
  var date = new Date(parseInt(data.time));
  var post = '<div class="posts">' +
    '<img src="'+data.url+'">' +
    '<div class="meta">'+
      '<div class="user"><span class="link user-link" onclick="renderProfile(\''+data.user+'\')"> @' + data.user + '</span></div>' +
      '<div class="timestamp">' + date.getDay() + ' ' + months[date.getMonth()] + ' ' + date.getYear() + '</div>' +
    '</div>' +
  '</div>';
  $('#wrapper').prepend(post);
}
function renderProfile(byUser) {
  $('#wrapper').html('');
  settings.startTime = 0;
  window.location.hash = '!/' + byUser;
  console.log(byUser);
  $('#title').html(byUser.replace("undefined"));
  refreshFeed(byUser);
}
function refreshFeed(byUser) {
  $.ajax({
    url : "/api/v1/pictures.json",
    dataType : "JSON",
    type : "get",
    data : {startTime : settings.startTime, pageSize : settings.pageSize, user : byUser},
    success : function(r) {
      if(r.error) {
        console.table(r);
      } else {
        for(i in r.data) {
          renderPost(r.data[i]);        
        }
      }
      settings.startTime = new Date().getTime();
    }
  });
}
$(function() {
  if((""+window.location).indexOf('#!') > -1) {
    var str = "" +  window.location.hash;
    renderProfile(str.replace("#!/"));
  } else {
    refreshFeed(null);
  }
  $('#refresh-button').click(function() {
    refreshFeed(null);
  });
  $('#upload-button').click(function() {
    $('#uploader').show('slow');
  });
  $('#cancel-upload').click(function() {
    $('#uploader').hide('slow');
  });
  var form = document.getElementById('uploader-form');
  form.onsubmit = function(event) {
    var f = new FormData();
    var fileSelect = document.getElementById('file-select');

    f.append('imageFile', fileSelect.files[0], fileSelect.files[0].name);
    f.append('userName' , document.getElementById('userName').value);

    $('#uploading-button').html('Uploading...');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/v1/picture.json', true);
  
    xhr.onload = function() {
      if(xhr.status == 200) {
        $('#uploading-button').html('Uploaded!');        
        $('#uploader').hide('slow');
        console.table(JSON.parse(xhr.responseText));
      } else {
        alert("Could not connect server");
      }
    };
  
    xhr.send(f);
    event.preventDefault();
    return false;
  };
});

