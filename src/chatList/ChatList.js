import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import styles from "./styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationImportant from "@material-ui/icons/NotificationImportant";

class ChatListComponent extends React.Component {
  render() {
    const { classes } = this.props;

    const chatsToOrder = [...this.props.chats];
    const orderedChats = chatsToOrder.sort(
      (a, b) =>
        b.messages[b.messages.length - 1].timestamp -
        a.messages[a.messages.length - 1].timestamp
    );

    // console.log("original chats", this.props.chats);
    // console.log("ordered chats", orderedChats);

    if (this.props.chats.length > 0) {
      return (
        <main className={classes.root}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            className={classes.newChatBtn}
            onClick={this.newChat}
          >
            New Message
          </Button>
          <List>
            {orderedChats.map((_chat, _index) => {
              return (
                <div key={_index}>
                  <ListItem
                    className={classes.listItem}
                    selected={
                      this.props.selectedChatIndex ===
                      this.props.chats.findIndex(
                        (element) => element === orderedChats[_index]
                      )
                    }
                    alignItems="flex-start"
                    // onClick={() => this.selectChat(_index)}
                    onClick={() =>
                      this.selectChat(
                        this.props.chats.findIndex(
                          (element) => element === orderedChats[_index]
                        )
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp">
                        {
                          _chat.users
                            .filter(
                              (_user) => _user !== this.props.userEmail
                            )[0]
                            .split("")[0]
                        }
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        _chat.users.filter(
                          (_user) => _user !== this.props.userEmail
                        )[0]
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" color="textPrimary">
                            {`${this.convertChatListTimestamp(
                              _chat.messages[_chat.messages.length - 1]
                                .timestamp
                            )}: `}
                            {/* {`${this.convertChatListTimestamp(
                              1603907520 * 1000
                            )}: `} */}
                            {
                              // display the first 30 characters of the most recent message
                              // _chat.messages[
                              //   _chat.messages.length - 1
                              // ].message.substring(0, 30)

                              _chat.messages[_chat.messages.length - 1]
                                .message !== null ? (
                                // _chat.messages[
                                //   _chat.messages.length - 1
                                // ].message.substring(0, 30)
                                _chat.messages[_chat.messages.length - 1]
                                  .message.length >= 30 ? (
                                  _chat.messages[
                                    _chat.messages.length - 1
                                  ].message.substring(0, 30) + "..."
                                ) : (
                                  _chat.messages[
                                    _chat.messages.length - 1
                                  ].message.substring(0, 30)
                                )
                              ) : (
                                <em>GIF</em>
                              )
                            }
                            {/* {
                                //add ... to messages that are 30 characters or greater
                                _chat.messages[_chat.messages.length - 1]
                                  .message.length >= 30
                                  ? "..."
                                  : null
                              } */}
                          </Typography>
                        </React.Fragment>
                      }
                    ></ListItemText>
                    {!_chat.receiverHasRead && !this.userIsSender(_chat) ? (
                      <ListItemIcon>
                        <NotificationImportant
                          className={classes.unreadMessage}
                        ></NotificationImportant>
                      </ListItemIcon>
                    ) : null}
                  </ListItem>
                  <Divider></Divider>
                </div>
              );
            })}
          </List>
        </main>
      );
    } else {
      return (
        <main className={classes.root}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            className={classes.newChatBtn}
            onClick={this.newChat}
          >
            New Message
          </Button>
        </main>
      );
    }
  }

  newChat = () => {
    this.props.newChatBtnFn();
  };

  // initialiseChat = () => {
  //   this.props.initialiseChatFn(
  //     this.orderedChats.findIndex((element) => element === this.props.chats[0])
  //   );
  // };

  selectChat = (index) => {
    this.props.selectChatFn(index);
  };

  userIsSender = (chat) =>
    chat.messages[chat.messages.length - 1].sender === this.props.userEmail;

  convertChatListTimestamp = (timestamp) => {
    if (timestamp) {
      const dayMs = 86400000;
      const weekMs = 604800000;
      const yearMs = 31540000000;

      const difference = Date.now() - timestamp;

      const dateString = new Date(timestamp).toString();
      const dateArr = dateString.split(" ");

      switch (true) {
        case difference < dayMs:
          const hourMinSeconds = dateString.split(" ")[4];
          const hourMinArr = hourMinSeconds.split(":");
          const hourMin = [hourMinArr[0], hourMinArr[1]].join(":");
          return hourMin;
        case difference < weekMs:
          return dateString.split(" ")[0];
        case difference < yearMs:
          return [dateArr[2], dateArr[1]].join(" ");
        case difference >= yearMs:
          return [dateArr[1], dateArr[2], dateArr[3]].join(" ");
        default:
          return "";
      }
    }
  };
}

export default withStyles(styles)(ChatListComponent);
