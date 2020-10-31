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

    console.log("friend typing STATE = ", this.state.friendTyping);
  }

  render() {
    const { classes, chat, user, friend } = this.props;

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
            {chat.users.filter((_usr) => _usr !== user)[0]}
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
                // display friend's messages on left and user's messages on right
                // we use dynamic class assignment to achieve this
                <div
                  key={_index}
                  className={
                    _msg.sender === user ? classes.userSent : classes.friendSent
                  }
                >
                  {this.convertChatViewTimestamp(_msg.timestamp) + ": "}
                  {_msg.gifRef === null ? (
                    this.checkUrl(_msg.message) ? (
                      <a href={_msg.message} target="_blank">
                        {_msg.message}
                      </a>
                    ) : (
                      _msg.message
                    )
                  ) : (
                    <img src={_msg.gifRef} alt="" className={classes.gif} />
                  )}
                </div>
              );
            })}
            {/* <div className={classes.content}>NEW MESSAGE</div> */}
            {/* {this.receiverHasRead() ? (
              <div className={classes.readReceipt}>read icon</div>
            ) : null} */}
            {this.state.friendTyping && (
              <div className={classes.friendSent}>{"Friend is typing..."}</div>
            )}
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
    // is there a better way to wait for props to load than setTimeout?
    // can i do this with promises?
    setTimeout(
      () => this.listenForTyping(this.props.user, this.props.friend),
      2000
    );
  };

  listenForTyping = async (user, friend) => {
    const docKey = [user, friend].sort().join(":");
    const docArr = docKey.split(":");
    const userIndex = docArr.findIndex((elem) => elem === user);
    const friendIndex = docArr.findIndex((elem) => elem === friend);
    console.log(
      `LISTENING FOR TYPING with user = ${user} and friend = ${friend}`
    );
    // console.log(`DOCKEY = ${docKey}`);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .onSnapshot((doc) => {
        const data = doc.data();

        if (data) {
          if (friendIndex === 0) {
            this.setState({ friendTyping: doc.data().user1Typing });
          } else if (friendIndex === 1) {
            this.setState({ friendTyping: doc.data().user2Typing });
          }
          // console.log("CHAT DATA = ", data.user2Typing);
        }

        // this.setState({ friendTyping: doc.data().user2Typing });

        // this.setState();
        // console.log("user1Typing: ", doc.data().user1Typing);
        // console.log("user2Typing: ", doc.data().user2Typing);
      });
    // if (chat) {
    //   chat.onSnapshot(() => console.log("chat changing"));
    // }
  };

  checkUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  };

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
