/* eslint-disable no-undef */

window.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
  zmClient = websdkready();

  /*
  // Check if zmClient is initialized
  if (!zmClient) {
    console.error('Zoom client is not initialized.');
    return;
  }

  // Check if updateVideoOptions method exists
  if (typeof zmClient.updateVideoOptions !== 'function') {
    console.error('updateVideoOptions method is not available on the Zoom client.');
    return;
  }

  console.log("trying to minimize");
  // Update video options
  // updateVideoOptions is currently not well supported.
  zmClient.updateVideoOptions({
    viewSizes: {
      default: {
        width: 244,
        height: 135
      },
        ribbon: {
          width: 300,
          height: 700
        }
    }
  }); */
  
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
    // YZYZ should not get here
    window.location.href = "./nav.html";
  }

  var c_width = 480;
  var c_height = 270;
  var isMinimizedClient = testTool.getCookie("isMinimizedClient");
  isMinimizedClient = (isMinimizedClient === 'true');
  
  console.log("managed to retreive: ", is_minimized);
  if (isMinimizedClient) {
    console.log("a, Minimaize");
    c_width = 244;
    c_height = 135;
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
  debug: true,
  webEndpoint: meetingConfig.webEndpoint,
  language: meetingConfig.lang,
  assetPath: avLibUrl,
      
  customize: {
    video: {
      // defaultViewType: "gallery", does not work
      popper: {
        disableDraggable: true
      },
      viewSizes: {
        		default: {    // ratio of 0.5625 - Width 240px, Height 135px
          			width: c_width, //480, //244, 
          			height: c_height // 270, //135 
        		},
        	ribbon: {     // Width 240px, Height 135px
          		width: 244, //240
          		height: 135
        	}
      },
    },
    chat: {
      popper: {
        disableDraggable: true,
        anchorElement: meetingSDKChatElement,
        placement: 'left'
      }
    },
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
  return zmClient;
}

