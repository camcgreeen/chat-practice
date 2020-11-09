import React from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
const firebase = require("firebase");

class ChatViewComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      friendOnline: false,
      // userTyping: false,
      friendTyping: false,
      usersTyping: [],
      friendFirstName: null,
      friendLastName: null,
    };
  }

  componentDidUpdate(prevProps) {
    const container = document.getElementById("chatview-container");

    // automatically scroll to the latest message in the conversation
    if (container) {
      // container.scrollTo(0, container.scrollHeight);
      setTimeout(function () {
        container.scrollTo(0, container.scrollHeight);
      }, 100);
    }

    // this.getUserInfo(this.props.friend);

    //console.log("friend typing STATE = ", this.state.friendTyping);
  }

  render() {
    const { classes, chat, user, friend } = this.props;

    let latestSentMessageFromUser;

    // this.listenForTyping(user, friend);

    if (chat === undefined) {
      return <main id="chatview-container" className={classes.content}></main>;
    } else {
      return (
        <div>
          <div className={classes.chatHeader}>
            {
              // this assumes a two person conversation which is fine for our needs
            }
            {/* <ListItemAvatar className={classes.name}>
              <Avatar alt="Remy Sharp">
                {chat.users.filter((_user) => _user !== user)[0].split("")[0]}
              </Avatar>
            </ListItemAvatar> */}
            {
              // <div>
              //   <h1 className={classes.name}>
              //     {chat.users.filter((_usr) => _usr !== user)[0]}
              //   </h1>
              //   {/* {this.props.friendOnline ? " | online" : this.props.lastLoggedOut} */}
              //   {/* {this.props.friendOnline ? " | online" : " | offline"} */}
              // </div>
            }
            {/* Your conversation with{" "} */}
            {/* {chat.users.filter((_user) => _user !== user)[0]} */}
            {this.getFriendName(chat, user)}
            {/* {chat.users.filter((_usr) => _usr !== user)[0]} */}
            {/* {this.getUserInfo(this.props.friend)} */}
            {/* {this.state.friendFirstName + " " + this.state.friendLastName} */}
            {/* {this.props.friendFirstName + " " + this.props.friendLastName} */}
            {}
            {/* {/* {this.props.friendOnline ? " | online" : this.props.lastLoggedOut} */}
            {this.props.friendOnline
              ? " | (online_symbol) | Active on Jabber"
              : ` | (offline_symbol) ${this.convertHeaderTimestamp(
                  this.props.friendLastLoggedOut
                )}`}
          </div>
          <main id="chatview-container" className={classes.content}>
            {chat.messages.map((_msg, _index) => {
              return (
                <>
                  <div
                    key={_index}
                    className={
                      _msg.sender === user
                        ? classes.userSent
                        : classes.friendSent
                    }
                  >
                    <strong>
                      {this.convertChatViewTimestamp(_msg.timestamp)}
                    </strong>
                    {/* <br /> */}
                    {/* // if _msg is the latest message from the user
                // and if receiver has read -> _chat.receiverHasRead
                // display icon with className={classes.readReceipt} */}
                    <div className={classes.message}>
                      {/* {this.convertChatViewTimestamp(_msg.timestamp) + ": "} */}
                      {_msg.gifRef === null ? (
                        this.checkUrl(_msg.message) ? (
                          <a
                            href={_msg.message}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {_msg.message}
                          </a>
                        ) : (
                          _msg.message
                        )
                      ) : (
                        <img src={_msg.gifRef} alt="" className={classes.gif} />
                      )}
                    </div>
                  </div>
                  {
                    //calculate the index and pass it here to make sure the read icon goes in the right place
                  }
                  {_index ===
                    this.findMostRecentMessageIndex(chat.messages, user) && (
                    <svg
                      height="100px"
                      width="100px"
                      fill="#000000"
                      xmlns="http://www.w3.org/2000/svg"
                      className={classes.readReceipt}
                      // xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.0"
                      x="0px"
                      y="0px"
                      viewBox="0 0 24 24"
                      enable-background="new 0 0 24 24"
                      // xml:space="preserve"
                    >
                      <path d="M22.8,11.4C22.6,11.1,18,5,12,5S1.4,11.1,1.2,11.4c-0.3,0.4-0.3,0.8,0,1.2C1.4,12.9,6,19,12,19s10.6-6.1,10.8-6.4  C23.1,12.2,23.1,11.8,22.8,11.4z M12,17c-2.8,0-5-2.2-5-5c0-2.8,2.2-5,5-5s5,2.2,5,5C17,14.8,14.8,17,12,17z"></path>
                      <circle cx="12" cy="12" r="2.5"></circle>
                    </svg>
                  )}
                </>
              );
            })}
            {/* <div className={classes.content}>NEW MESSAGE</div> */}
            {/* {this.receiverHasRead() ? (
              <div className={classes.readReceipt}>read icon</div>
            ) : null} */}
            {/* {this.state.friendTyping && (
              <div className={classes.friendSent}>{"Friend is typing..."}</div>
            )} */}
            {this.checkFriendTyping(friend, this.state.usersTyping) && (
              // console.log(`selected friend ${friend} is typing!!!!`)
              <div className={classes.friendSent}>{"Friend is typing..."}</div>
            )}
            {/* {<div className={classes.readReceipt}>Message received</div>} */}
          </main>
          )
        </div>
      );
    }
  }

  // componentDidUpdate = () => {
  //   // console.log("State = ", this.state);
  // };

  componentDidMount = () => {
    // setTimeout(
    //   () => this.listenForTyping(this.props.user, this.props.friend),
    //   2000
    // );

    // is there a better way to wait for props to load than setTimeout?
    // can i do this with promises?
    setTimeout(this.listenForTyping, 2000);
    setTimeout(this.getUserInfo, 2000);
  };

  getFriendName = (chat, user) => {
    if (chat && user) {
      return chat.users.filter((_user) => _user !== user)[0];
    }
  };

  findMostRecentMessageIndex = (messages, user) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].receiverRead && messages[i].sender === user) {
        return i;
      }
    }
  };

  // updateUserInfo = () => {
  //   this.props.updateUserInfoFn();
  //   // if (friend) {
  //   // firebase
  //   //   .firestore()
  //   //   .collection("users")
  //   //   .doc(friend)
  //   //   .get()
  //   //   .then((doc) => {
  //   //     console.log("getting user data...");
  //   //     const data = doc.data();
  //   //     console.log(`data for user ${friend} =`, data);
  //   //     this.setState({
  //   //       friendFirstName: data.firstName,
  //   //       friendLastName: data.lastName,
  //   //     });
  //   //     // return [data.firstName, data.lastName];
  //   //     // this.setState({ firstName: data.firstName, lastName: data.lastName });
  //   //   });
  //   // }
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .onSnapshot((res) => {
  //       const users = res.docs.map((_doc) => _doc.data());
  //       console.log("users =", users);
  //     });
  // };

  listenForTyping = () => {
    firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", this.props.user)
      .onSnapshot((res) => {
        // console.log("res", res.data());
        const chats = res.docs.map((_doc) => _doc.data());
        // console.log(chats);
        // console.log("modified chats = ", chats);
        // console.log("chats.users = ", chats[0].users);

        const usersTyping = [];

        chats.forEach((chat) => {
          const userTypingObj = {};
          userTypingObj[chat.users[0]] = chat.user1Typing;
          userTypingObj[chat.users[1]] = chat.user2Typing;
          // console.log("USER TYPING OBJ = ", userTypingObj);
          usersTyping.push(userTypingObj);
          // const user1TypingObj = {};
          // const user2TypingObj = {};
          // user1TypingObj[chat.users[0]] = chat.user1Typing;
          // console.log("user1TypingObj =", user1TypingObj);
          // user2TypingObj[chat.users[1]] = chat.user2Typing;
          // const typing = [user1TypingObj, user2TypingObj];
          // usersTyping.push(typing);
        });

        console.log("usersTyping = ", usersTyping);

        this.setState({ usersTyping });

        // const user1TypingObj = {};
        // const user2TypingObj = {};
        // user1TypingObj[chats.users[0]] = chats.user1Typing;
        // user2TypingObj[chats.users[1]] = chats.user2Typing;
        // const usersTyping = [user1TypingObj, user2TypingObj];
        // console.log("usersTyping = ", usersTyping);
      });
  };

  checkFriendTyping = (friend, usersTyping) => {
    // console.log("usersTYPING =", usersTyping);
    // console.log(`checking if friend ${friend} is typing...`);
    for (let obj of usersTyping) {
      // console.log(`typeof friend is ${typeof Object.keys(obj)[0]}`); // string
      // console.log("obj =", obj);
      if (obj[friend]) {
        // console.log("obj[friend] = ", obj[friend]);
        // console.log(`CONFIRMED THAT FRIEND ${friend} IS TYPING`);
        return true;
      }
    }
    return false;
  };

  // listenForTyping = async (user, friend) => {
  //   console.log(`listening for typing from friend ${friend}`);
  //   const docKey = [user, friend].sort().join(":");
  //   const docArr = docKey.split(":");
  //   const friendIndex = docArr.findIndex((elem) => elem === friend);
  //   // console.log(
  //   //   `LISTENING FOR TYPING with user = ${user} and friend = ${friend}`
  //   // );
  //   // console.log(`DOCKEY = ${docKey}`);
  //   await firebase
  //     .firestore()
  //     .collection("chats")
  //     .doc(docKey)
  //     .onSnapshot((doc) => {
  //       const data = doc.data();

  //       if (data) {
  //         if (friendIndex === 0) {
  //           this.setState({ friendTyping: data.user1Typing });
  //         } else if (friendIndex === 1) {
  //           this.setState({ friendTyping: data.user2Typing });
  //         }

  //         // if (data.)
  //         // if (data.receiverHasRead) console.log(`${friend} has read`);
  //         // else console.log(`${friend} has NOT read`);
  //         // if (data)
  //         // console.log("CHAT DATA = ", data.user2Typing);
  //       }

  //       // this.setState({ friendTyping: doc.data().user2Typing });

  //       // this.setState();
  //       // console.log("user1Typing: ", doc.data().user1Typing);
  //       // console.log("user2Typing: ", doc.data().user2Typing);
  //     });
  //   // if (chat) {
  //   //   chat.onSnapshot(() => console.log("chat changing"));
  //   // }
  // };

  checkUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  };

  // convertUrl = (text) => {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return text.replaceAll(urlRegex, )
  // }

  convertChatViewTimestamp = (timestamp) => {
    if (timestamp) {
      const dayMs = 86400000;
      const difference = Date.now() - timestamp;

      const dateString = new Date(timestamp).toString();
      const hourMinSeconds = dateString.split(" ")[4];
      const hourMinArr = hourMinSeconds.split(":");
      const hourMin = [hourMinArr[0], hourMinArr[1]].join(":");

      if (difference < dayMs) {
        return hourMin;
      } else {
        const dayMonthYearArr = dateString.split(" ");
        const dayMonthYear = [
          dayMonthYearArr[1],
          dayMonthYearArr[2],
          dayMonthYearArr[3],
        ].join(" ");
        const dayMonthYearTime = `${dayMonthYear}, ${hourMin}`;
        return dayMonthYearTime;
      }
    }
  };

  convertHeaderTimestamp = (timestamp) => {
    if (timestamp) {
      const hourMs = 3600000;
      const dayMs = 86400000;
      const weekMs = 604800000;
      const yearMs = 31540000000;

      const difference = Date.now() - timestamp;
      // const difference = yearMs;

      let plural;
      let dateString;
      let dateArray;
      let dateFormatted;

      switch (true) {
        case difference < hourMs:
          const differenceMins = Math.ceil(difference / 1000 / 60);
          plural = differenceMins >= 2;
          return ` | ${differenceMins} ${plural ? "mins" : "min"} ago`;
        case difference < dayMs:
          const differenceHours = Math.round(difference / 1000 / 60 / 60);
          plural = differenceHours >= 2;
          return ` | ${differenceHours} ${plural ? "hours" : "hour"} ago`;
        case difference < weekMs:
          dateString = new Date(timestamp).toString();
          return ` | ${dateString.split(" ")[0]}`;
        case difference < yearMs:
          dateString = new Date(timestamp).toString();
          dateArray = dateString.split(" ");
          dateFormatted = [dateArray[0], dateArray[1], dateArray[2]].join(" ");
          return ` | ${dateFormatted}`;
        case difference >= yearMs:
          dateString = new Date(timestamp).toString();
          dateArray = dateString.split(" ");
          dateFormatted = [
            dateArray[0],
            dateArray[1],
            dateArray[2],
            dateArray[3],
          ].join(" ");
          return ` | ${dateFormatted}`;
        default:
          //
          return "";
      }
    }
  };

  // receiverHasRead = async () => {
  //   // return [firebase.auth().currentUser.email, this.state.username]
  //   //   .sort()
  //   //   .join(":");
  //   const docKey = "100milliseconds@gmail.com:c.c.green@outlook.com";
  //   // const docKey = this.buildDocKey();
  //   const chat = await firebase
  //     .firestore()
  //     .collection("chats")
  //     .doc(docKey)
  //     .get();
  //   return chat.receiverHasRead;
  //   return false;
  // };
}

export default withStyles(styles)(ChatViewComponent);
