import React from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import ReactGiphySearchbox from "react-giphy-searchbox";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import styles from "./styles";
import { Button, withStyles } from "@material-ui/core";
const firebase = require("firebase");

class ChatTextBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatText: "",
      // gifRef: null,
      showEmojiPicker: false,
      showGifPicker: false,
      userTyping: false,
    };
  }

  // componentDidUpdate() {
  //   const container = document.getElementById("chatview-container");

  //   // automatically scroll to the latest message in the conversation
  //   if (container) {
  //     container.scrollTo(0, container.scrollHeight);
  //   }
  // }

  render() {
    const { classes } = this.props;

    const emojiPickerStyle = {
      position: "absolute",
      right: "50px",
      bottom: "50px",
      width: "250px",
      // height: "100px",
      // height: "10px",
      // transform: "translate(50%, -50%)",
    };

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          id="chat-text-box"
          className={classes.chatTextBox}
          autoComplete="off"
          onFocus={this.userClickedInput}
          // onClick={() => this.selectChat(this.props.selectedChatIndex)}
          onBlur={() => this.setState({ userTyping: false })}
          // onSubmit={() => this.setState({ userTyping: false })}
          // onFocusOut={() => this.setState({ userTyping: false })}
          placeholder="Type something..."
          onKeyUp={(e) => this.userTyping(e)}
        ></TextField>
        <Button
          className={classes.gifPickerBtn}
          variant="contained"
          color="primary"
          type="submit"
          onClick={() =>
            this.setState({
              showGifPicker: !this.state.showGifPicker,
              showEmojiPicker: false,
            })
          }
        >
          GIFs
        </Button>
        {
          // NEED TO CHANGE THIS AS API KEY IS EXPOSED
          this.state.showGifPicker && (
            <div className="searchboxWrapper">
              <ReactGiphySearchbox
                apiKey="i618OfhaYgdDxaTqaH1k6Ok37Wg7dy4h"
                onSelect={(item) => this.submitGif(item)}
                searchPlaceholder={"Search GIFs..."}
                gifListHeight={400}
                masonryConfig={[
                  { columns: 2, imageWidth: 110, gutter: 5 },
                  { mq: "850px", columns: 1, imageWidth: 400, gutter: 5 },
                ]}
              />
            </div>
          )
        }
        <Button
          className={classes.emojiPickerBtn}
          variant="contained"
          color="primary"
          type="submit"
          onClick={() =>
            this.setState({
              showEmojiPicker: !this.state.showEmojiPicker,
              showGifPicker: false,
            })
          }
        >
          Emoji
        </Button>
        {this.state.showEmojiPicker && (
          <Picker
            // className={classes.emojiPicker}
            style={emojiPickerStyle}
            // onSelect={(emoji) => alert("Hey:" + emoji.native)}
            onSelect={(emoji) => this.addEmoji(emoji.native)}
          />
        )}
        <Send className={classes.sendBtn} onClick={this.handleClick}></Send>
      </div>
    );
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const docKey = this.buildDocKey();
    const docArr = docKey.split(":");
    // const user = docKey.split(":")[0];
    // console.log(`this.state.email = ${this.props.email}`);
    const userIndex = docArr.findIndex((elem) => elem === this.props.email);
    // console.log(`userIndex = ${userIndex}`);
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();

    if (chat.exists) {
      if (!prevState.userTyping && this.state.userTyping) {
        this.updateTypingStatus(userIndex, true, docKey);
        // console.log("user now typing");
      }
      if (prevState.userTyping && !this.state.userTyping) {
        this.updateTypingStatus(userIndex, false, docKey);
        // console.log("user stopped typing");
      }
    }
  };

  selectChat = (index) => {
    this.props.selectChatFn(index);
  };

  updateTypingStatus = (idx, status, docKey) => {
    // console.log(
    //   `called with idx ${idx}, status ${status} and docKey ${docKey}`
    // );
    if (idx === 0) {
      // console.log(`updating user 1 to typing: ${status}`);
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ user1Typing: status });
    } else if (idx === 1) {
      // console.log(`updating user 2 to typing: ${status}`);
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ user2Typing: status });
    }
  };

  buildDocKey = () => [this.props.email, this.props.friend].sort().join(":");

  addEmoji = (emoji) => {
    const currText = document.getElementById("chat-text-box").value;
    const newText = currText + emoji;
    document.getElementById("chat-text-box").value = newText;
    this.setState({ chatText: newText });
  };

  submitGif = (item) => {
    // this.setState({ gifRef: item.images.original.url }, () => {
    //   const docKey = this.props.users.sort().join(":");
    //   firebase
    //     .firestore()
    //     .collection("chats")
    //     .doc(docKey)
    //     .update({
    //       messages: firebase.firestore.FieldValue.arrayUnion({
    //         sender: this.props.users[0],
    //         message: null,
    //         timestamp: Date.now(),
    //         gifRef: this.state.gifRef,
    //       }),
    //       receiverHasRead: false,
    //     });
    //   this.setState({ showGifPicker: false });
    // });
    this.setState({ showGifPicker: false });
    this.props.submitGifFn(item.images.original.url);
  };

  // if they clicked enter, submit the message
  userTyping = (e) => {
    if (!this.state.userTyping) {
      this.setState({ userTyping: true });
    }
    e.keyCode === 13
      ? this.setState(
          { chatText: e.target.value, userTyping: false },
          this.submitMessage
        )
      : this.setState({ chatText: e.target.value });
  };
  handleClick = () => {
    if (document.getElementById("chat-text-box").value !== null) {
      this.setState(
        { chatText: document.getElementById("chat-text-box").value },
        this.submitMessage
      );
    }
  };
  // make sure input isn't an empty string or a string that only contains spaces
  messageValid = (txt) => txt && txt.replace(/\s/g, "").length;
  submitMessage = () => {
    // this.selectChat(this.props.selectedChatIndex);
    if (this.messageValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.getElementById("chat-text-box").value = "";
    }
    // setTimeout(() => {
    //   const container = document.getElementById("chatview-container");
    //   console.log("container = ", container);

    //   // automatically scroll to the latest message in the conversation
    //   if (container) {
    //     container.scrollTo(0, container.scrollHeight);
    //   }
    // }, 50);
  };
  userClickedInput = () => {
    this.props.messageReadFn();
    if (!this.state.userTyping) this.setState({ userTyping: true });
  };
}

export default withStyles(styles)(ChatTextBoxComponent);
