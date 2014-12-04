Nodestagram

A very basic express JS web app. It allows users to upload pictures and view the pictures. It uses a JSON API internally to fetch images.
API help

You can simply call api/v1/pictures.json?help=1 to get help on API.

      {
        "Title" : "API Ref | Get Pictures - Nodestagram",
        "Response": {
          "error" : false,
          "code" : 200,
          "msg" : "Message",
          "data" : [
            {
              "time" : 1417725298547,
              "user" : "bogas04",
              "url" : "img1.jpg"
            }
          ]
        },
        "Parameters" : {
          "user" : {
            "optional" : true,
            "desc" : "Returns all pictures (max 20) from given user",
            "example" : "For eg : http://127.0.0.1:8080/v1/pictures.json?user=bogas04"
            },
            "startTime" : {
              "optional" : true,
              "desc" : "Filters pictures which are taken after given the given time in milliseconds since 1, Jan, 1970.",
              "example" : " For eg :  http://127.0.0.1:8080/v1/pictures.json?startTime=1417725298547"
            },
            "endTime" : {
              "optional" : true,
              "desc" : "Filters pictures which are taken before the given time in milliseconds since 1, Jan, 1970.",
              "example" : " For eg :  http://127.0.0.1:8080/v1/pictures.json?endTime=1417725298547"
            },
            "startPage" : {
              "optional" : true,
              "desc" : "Filters pictures which are taken after given parameter th picture.",
              "example":" For eg this will return (max 20) pictures after 10th picture uploaded on server :  http://127.0.0.1:8080/v1/pictures.json?startPage=10"
            },
            "pageSize": {
              "optional" : true,
              "desc" : "Shows given parameter pictures in total. (max 20)",
              "example":" For eg :  http://127.0.0.1:8080/v1/pictures.json?pageSize=12"
            }
          }
      }
  
