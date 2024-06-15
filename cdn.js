/* eslint-disable no-undef */
window.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
  websdkready();
});

function websdkready() {
  var testTool = window.testTool;
  // get meeting args from url
  var tmpArgs = testTool.parseQuery();
  var meetingConfig = {
    sdkKey: tmpArgs.sdkKey,
    meetingNumber: tmpArgs.mn,
    userName: (function () {
      if (tmpArgs.name) {
        try {
          return testTool.b64DecodeUnicode(tmpArgs.name);
        } catch (e) {
          return tmpArgs.name;
        }
      }
      return (
        "CDN#" +
        tmpArgs.version +
        "#" +
        testTool.detectOS() +
        "#" +
        testTool.getBrowserInfo()
      );
    })(),
    passWord: tmpArgs.pwd,
    leaveUrl: "/index.html",
    role: parseInt(tmpArgs.role, 10),
    userEmail: (function () {
      try {
        return testTool.b64DecodeUnicode(tmpArgs.email);
      } catch (e) {
        return tmpArgs.email;
      }
    })(),
    lang: tmpArgs.lang,
    signature: tmpArgs.signature || "",
    china: tmpArgs.china === "1",
  };

  // a tool use debug mobile device
  if (testTool.isMobileDevice()) {
    vConsole = new VConsole();
  }

  if (!meetingConfig.signature) {
    window.location.href = "./nav.html";
  }
  // WebSDK Embedded init
  var rootElement = document.getElementById("ZoomEmbeddedApp");
  var meetingSDKChatElement = document.getElementById("meetingSDKChatElement");
  var zmClient = ZoomMtgEmbedded.createClient();
  var tmpPort = window.location.port === "" ? "" : ":" + window.location.port;
  var avLibUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    tmpPort +
    "/lib";
  zmClient
    .init({


  zoomAppRoot: rootElement,
//YZYZ   language: 'en-US',

   debug: true,
      zoomAppRoot: rootElement, //meetingSDKElement, meetingSDKChatElement
      webEndpoint: meetingConfig.webEndpoint,
      language: meetingConfig.lang,
      assetPath: avLibUrl,
      
  customize: {
    video: {
      popper: {
        disableDraggable: true
      }
    },
    chat: {
      popper: {
        disableDraggable: true,
        anchorElement: meetingSDKChatElement,
        placement: 'top'
      }
    },
//YZYZ  },

      
      
      /* YZYZ
      
      debug: true,
      zoomAppRoot: rootElement, //meetingSDKElement, meetingSDKChatElement
      webEndpoint: meetingConfig.webEndpoint,
      language: meetingConfig.lang,
      assetPath: avLibUrl,
      customize: {

     	video: {
        defaultViewType: "ribbon",    // does not work ???
        isResizable: true,
      		popper: { 
        		disableDraggable: false
      		},
      		viewSizes: {
        		default: {    // ratio of 0.5625 - Width 240px, Height 135px
          			width: 244, // 480,
          			height: 135 // 270
        		},
        	ribbon: {     // Width 240px, Height 135px
          		width: 244, //240
          		height: 135
        	}
 	},
chat: {
      popper: {
        disableDraggable: false,
        //meetingSDKChatElement,
        anchorElement: rootElement, 
        placement: 'right' // does not work for some reason
      }
    },
        	
      }, */ // YZYZ
        meetingInfo: [
          "topic",
          "host",
          "mn",
          "pwd",
          "telPwd",
          "invite",
          "participant",
          "dc",
          "enctype",
        ],
        toolbar: {
          buttons: [
            {
              text: "CustomizeButton",
              className: "CustomizeButton",
              onClick: () => {
                console.log("click Customer Button");
              },
            },
          ],
        },
      },
    })
    .then((e) => {
      console.log("success", e);
    })
    .catch((e) => {
      console.log("error", e);
    });

  // WebSDK Embedded join
  zmClient
    .join({
      sdkKey: meetingConfig.sdkKey,
      signature: meetingConfig.signature,
      meetingNumber: meetingConfig.meetingNumber,
      userName: meetingConfig.userName,
      password: meetingConfig.passWord,
      userEmail: meetingConfig.userEmail,

      success: function () {
                ZoomMtg.showChat({ display: 'chat' }); // Set chat mode
            },
            error: function (res) {
                console.error(res);
            }
    })
    .then((e) => {
      console.log("success", e);
    })
    .catch((e) => {
      console.log("error", e);
    });
}
