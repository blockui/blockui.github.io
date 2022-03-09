const config = {
  common: {
    portalViewSelector: ".portal-view",
    hashSlice1:16,
    authPwdExpireSec:1800,
    IM_WS_CONNECT_KEY_1:"fDvRKDd4U33sigu5mzbwQRmrzeqhf1UW71WUbafZ6eESgujyHuu0vMtKl0YzUcQJsprEaTw+BZJfPv3yR1XDmQ==",
  },
  blockChain:{
    biAnWsApi:"wss://stream.binance.com:9443",
    enableBiAnWs:true,
    biAnWsInitStream:[`btcusdt@kline_1m`,`ethusdt@kline_1m`,`bnbusdt@kline_1m`]
  },
  ui: {
    HomeTopBarHeight: 80,
    CatSearchPickSelector: ".weui-half-screen-dialog__hd__main",
    PageHeaderHeight: 48,
    PageFooterHeight: 48,
    AppMaxWidth: 1024,
    ChatStatusBarHeight: 40,
    IAppCss: ".weui-toptips{top:4px !important;}",
    MessageExtensionPanelHeight: 290,
    AppStatusBarHeight: 0,
    HomeSwiperBannerHeight: 180,
    WeAppBarBoxZIndex: 1100,
    WeAppBarZIndex: 1100,
    WeAppBarHeight: 48,
    MapHeightGeoChange: 300,
    HomeTabBarHeight: 60,
    MsgFooterBarHeight: 52,
    SubCatsViewHeight: 32,
    WeAppBarHeightDense: 48,
    SidebarFoldWidth: 78,
    SidebarUnFoldWidth: 220,
    WeAppBarBoxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%)",
    WeAppBarBoxShadow1: "0px 4px 5px 0px rgb(0 0 0 / 14%)",
    WeAppBarBoxShadow2: "0px 1px 10px 0px rgb(0 0 0 / 12%)"
  },
  constants:{
    group:{
      GroupModifyType:{
        GROUP_MODIFY_TYPE_ADD:1,
        GROUP_MODIFY_TYPE_DEL:2
      },
      GroupType:{
        GROUP_TYPE_NORMAL:1,
        GROUP_TYPE_TMP:2
      }
    },
    im:{
      "ServiceID": {
        "SID_LOGIN": 1,
        "SID_BUDDY_LIST": 2,
        "SID_MSG": 3,
        "SID_GROUP": 4,
        "SID_FILE": 5,
        "SID_SWITCH_SERVICE": 6,
        "SID_OTHER": 7,
        "SID_INTERNAL": 8
      },
      "BuddyListCmdID": {
        "CID_BUDDY_LIST_RECENT_CONTACT_SESSION_REQUEST": 513,
        "CID_BUDDY_LIST_RECENT_CONTACT_SESSION_RESPONSE": 514,
        "CID_BUDDY_LIST_STATUS_NOTIFY": 515,
        "CID_BUDDY_LIST_USER_INFO_REQUEST": 516,
        "CID_BUDDY_LIST_USER_INFO_RESPONSE": 517,
        "CID_BUDDY_LIST_REMOVE_SESSION_REQ": 518,
        "CID_BUDDY_LIST_REMOVE_SESSION_RES": 519,
        "CID_BUDDY_LIST_ALL_USER_REQUEST": 520,
        "CID_BUDDY_LIST_ALL_USER_RESPONSE": 521,
        "CID_BUDDY_LIST_USERS_STATUS_REQUEST": 522,
        "CID_BUDDY_LIST_USERS_STATUS_RESPONSE": 523,
        "CID_BUDDY_LIST_CHANGE_AVATAR_REQUEST": 524,
        "CID_BUDDY_LIST_CHANGE_AVATAR_RESPONSE": 525,
        "CID_BUDDY_LIST_PC_LOGIN_STATUS_NOTIFY": 526,
        "CID_BUDDY_LIST_REMOVE_SESSION_NOTIFY": 527,
        "CID_BUDDY_LIST_DEPARTMENT_REQUEST": 528,
        "CID_BUDDY_LIST_DEPARTMENT_RESPONSE": 529,
        "CID_BUDDY_LIST_AVATAR_CHANGED_NOTIFY": 530,
        "CID_BUDDY_LIST_CHANGE_SIGN_INFO_REQUEST": 531,
        "CID_BUDDY_LIST_CHANGE_SIGN_INFO_RESPONSE": 532,
        "CID_BUDDY_LIST_SIGN_INFO_CHANGED_NOTIFY": 533
      },
      "MessageCmdID": {
        "CID_MSG_DATA": 769,
        "CID_MSG_DATA_ACK": 770,
        "CID_MSG_READ_ACK": 771,
        "CID_MSG_READ_NOTIFY": 772,
        "CID_MSG_TIME_REQUEST": 773,
        "CID_MSG_TIME_RESPONSE": 774,
        "CID_MSG_UNREAD_CNT_REQUEST": 775,
        "CID_MSG_UNREAD_CNT_RESPONSE": 776,
        "CID_MSG_LIST_REQUEST": 777,
        "CID_MSG_LIST_RESPONSE": 778,
        "CID_MSG_GET_LATEST_MSG_ID_REQ": 779,
        "CID_MSG_GET_LATEST_MSG_ID_RSP": 780,
        "CID_MSG_GET_BY_MSG_ID_REQ": 781,
        "CID_MSG_GET_BY_MSG_ID_RES": 782,
        "CID_MSG_CALL_REQ": 783,
        "CID_MSG_CALL_RES": 784
      },
      "GroupCmdID": {
        "CID_GROUP_NORMAL_LIST_REQUEST": 1025,
        "CID_GROUP_NORMAL_LIST_RESPONSE": 1026,
        "CID_GROUP_INFO_REQUEST": 1027,
        "CID_GROUP_INFO_RESPONSE": 1028,
        "CID_GROUP_CREATE_REQUEST": 1029,
        "CID_GROUP_CREATE_RESPONSE": 1030,
        "CID_GROUP_CHANGE_MEMBER_REQUEST": 1031,
        "CID_GROUP_CHANGE_MEMBER_RESPONSE": 1032,
        "CID_GROUP_SHIELD_GROUP_REQUEST": 1033,
        "CID_GROUP_SHIELD_GROUP_RESPONSE": 1034,
        "CID_GROUP_CHANGE_MEMBER_NOTIFY": 1035
      },
      "OtherCmdID": {
        "CID_OTHER_HEARTBEAT": 1793,
        "CID_OTHER_STOP_RECV_PACKET": 1794,
        "CID_OTHER_VALIDATE_REQ": 1795,
        "CID_OTHER_VALIDATE_RSP": 1796,
        "CID_OTHER_GET_DEVICE_TOKEN_REQ": 1797,
        "CID_OTHER_GET_DEVICE_TOKEN_RSP": 1798,
        "CID_OTHER_ROLE_SET": 1799,
        "CID_OTHER_ONLINE_USER_INFO": 1800,
        "CID_OTHER_MSG_SERV_INFO": 1801,
        "CID_OTHER_USER_STATUS_UPDATE": 1802,
        "CID_OTHER_USER_CNT_UPDATE": 1803,
        "CID_OTHER_SERVER_KICK_USER": 1805,
        "CID_OTHER_LOGIN_STATUS_NOTIFY": 1806,
        "CID_OTHER_PUSH_TO_USER_REQ": 1807,
        "CID_OTHER_PUSH_TO_USER_RSP": 1808,
        "CID_OTHER_GET_SHIELD_REQ": 1809,
        "CID_OTHER_GET_SHIELD_RSP": 1810,
        "CID_OTHER_FILE_TRANSFER_REQ": 1841,
        "CID_OTHER_FILE_TRANSFER_RSP": 1842,
        "CID_OTHER_FILE_SERVER_IP_REQ": 1843,
        "CID_OTHER_FILE_SERVER_IP_RSP": 1844,
        "CID_OTHER_PUSH_NOTICE_REQ": 1845,
        "CID_OTHER_PUSH_NOTICE_RSP": 1846,
        "CID_OTHER_PUSH_NOTICE": 1847
      },
      "LoginCmdID": {
        "CID_LOGIN_REQ_MSGSERVER": 257,
        "CID_LOGIN_RES_MSGSERVER": 258,
        "CID_LOGIN_REQ_USERLOGIN": 259,
        "CID_LOGIN_RES_USERLOGIN": 260,
        "CID_LOGIN_REQ_LOGINOUT": 261,
        "CID_LOGIN_RES_LOGINOUT": 262,
        "CID_LOGIN_KICK_USER": 263,
        "CID_LOGIN_REQ_DEVICETOKEN": 264,
        "CID_LOGIN_RES_DEVICETOKEN": 265,
        "CID_LOGIN_REQ_KICKPCCLIENT": 266,
        "CID_LOGIN_RES_KICKPCCLIENT": 267,
        "CID_LOGIN_REQ_PUSH_SHIELD": 268,
        "CID_LOGIN_RES_PUSH_SHIELD": 269,
        "CID_LOGIN_REQ_QUERY_PUSH_SHIELD": 270,
        "CID_LOGIN_RES_QUERY_PUSH_SHIELD": 271
      },
      "LoginEvents": [
        "NONE",
        "LOGINING",
        "LOGIN_OK",
        "LOGIN_INNER_FAILED",
        "LOGIN_DISCONNECT",
        "LOGIN_AUTH_FAILED",
        "LOGIN_OUT",
        "LOCAL_LOGIN_SUCCESS",
        "LOCAL_LOGIN_MSG_SERVICE",
        "PC_ONLINE",
        "PC_OFFLINE",
        "KICK_PC_SUCCESS",
        "KICK_PC_FAILED"
      ],
      "SocketEvents": [
        "NONE",
        "REQING_MSG_SERVER_ADDRS",
        "REQ_MSG_SERVER_ADDRS_FAILED",
        "REQ_MSG_SERVER_ADDRS_SUCCESS",
        "CONNECTING_MSG_SERVER",
        "CONNECT_MSG_SERVER_SUCCESS",
        "CONNECT_MSG_SERVER_FAILED",
        "MSG_SERVER_DISCONNECTED"
      ],
      "ReconnectEvents": [
        "NONE",
        "CONNECTING",
        "SUCCESS",
        "DISABLE"
      ],
      "ENC_TYPE": {
        "NO_ENCRYPT": 0,
        "S_RSA": 1
      },
      "SESSION_TYPE": {
        "SESSION_TYPE_SINGLE": 1,
        "SESSION_TYPE_GROUP": 2,
        "SESSION_TYPE_SYSTEM": 3,
        "SESSION_TYPE_NOTICE": 4,
        "SESSION_TYPE_CHATROOM": 5,
        "SESSION_TYPE_PUBLIC_ACT": 6
      },
      "MSG_SEND_STATUS": {
        "SENDING": 1,
        "SEND_FAILURE": 2,
        "SEND_OK": 3,
        "SEND_TIME_OUT": 4,
        "CALL_NOT_CONNECT": 20,
        "CALL_HUNG_UP": 21,
        "CALLEE_CONFIRMED": 22,
        "SIGNALING_MSG": 23,
        "CALL_END": 24,
      },
      "MSG_TYPE": {
        "MSG_TYPE_TEXT": 1,
        "MSG_TYPE_IMAGE": 2,
        "MSG_TYPE_AUDIO": 3,
        "MSG_TYPE_VIDEO": 4,
        "MSG_TYPE_AUDIO_CALL": 5,
        "MSG_TYPE_VIDEO_CALL": 6,
        "MSG_TYPE_SYSTEM": 136,
        "MSG_TYPE_NOTICE_FRIEND": 137,
        "MSG_TYPE_NOTICE_SYSTEM": 138
      }
    },
    friend:{
      "Invite_Status": {
        "AGREE": 1,
        "WAITING_AGREE": 20,
        "WAITING_AGREE_1": 21,
        "DISAGREE": 30,
        "DISAGREE_1": 31,
        "BLACK_LIST": 4,
        "REMOVE": 5
      }
    },
    circle:{
      Circle_Comment_Type: {
        "LIKE": 1,
        "COMMENT": 2
      },
      Circle_Type: {
        "Mark": 1,
        "Shop": 2,
        "Url": 3,
        "Text": 4,
        "Image": 5,
        "Audio": 6,
        "Video": 7,
        "Other": 100
      }
    }
  }
}

export default config
