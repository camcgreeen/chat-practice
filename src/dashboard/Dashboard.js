import React from "react";
import ChatListComponent from "../chatList/ChatList";
import NewChatComponent from "../newChat/NewChat";
import ChatViewComponent from "../chatView/ChatView";
import ChatTextBoxComponent from "../chatTextBox/ChatTextBox";
import styles from "./styles";
import { Button, withStyles } from "@material-ui/core";

const firebase = require("firebase");

class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      // selectedChat: 0,
      newChatFormVisible: false,
      email: null,
      friend: null,
      chats: [],
      online: false,
      friendOnline: false,
      lastLoggedOut: "",
      friendLastLoggedOut: "",
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ChatListComponent
          history={this.props.history}
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}
        ></ChatListComponent>
        {this.state.newChatFormVisible ? null : (
          <ChatViewComponent
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
            friendOnline={this.state.friendOnline}
            friendLastLoggedOut={this.state.friendLastLoggedOut}
          ></ChatViewComponent>
        )}
        {this.state.chats.length > 0 &&
        this.state.selectedChat !== null &&
        !this.state.newChatFormVisible ? (
          <ChatTextBoxComponent
            submitMessageFn={this.submitMessage}
            submitGifFn={this.submitGif}
            messageReadFn={this.messageRead}
            users={[this.state.email, this.state.friend]}
          ></ChatTextBoxComponent>
        ) : null}
        {this.state.newChatFormVisible ? (
          <NewChatComponent
            goToChatFn={this.goToChat}
            newChatSubmitFn={this.newChatSubmit}
            userEmail={this.state.email}
          ></NewChatComponent>
        ) : null}
        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  signOut = () => {
    console.log("SIGNING OUT");
    this.setState({ lastLoggedOut: Date.now() }, async () => {
      await firebase
        .firestore()
        .collection("users")
        .doc(this.state.email)
        .update({ lastLoggedOut: this.state.lastLoggedOut });
      console.log("logged out at: ", this.state.lastLoggedOut);
      firebase.auth().signOut();
    });
  };

  chatExists = async () => {
    const docKey = [firebase.auth().currentUser.email, this.state.username]
      .sort()
      .join(":");
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();
    console.log(chat.exists);
    return chat.exists;
  };

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
    if (this.state.chats.length > 0) {
      const friend = this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0];
      this.setState({ friend }, () => {
        console.log(
          `Selected chat ${this.state.selectedChat} with friend ${this.state.friend}`
        );
        firebase
          .firestore()
          .collection("users")
          .doc(this.state.friend)
          .onSnapshot((doc) => {
            console.log("doc.data() = ", doc.data());
            this.setState(
              {
                friendOnline: doc.data().online,
                friendLastLoggedOut: doc.data().lastLoggedOut,
              },
              () => {
                // console.log("prevState", this.state.prevChats);
                // console.log("state", this.state);
                console.log(
                  `${this.state.friend} last logged out ${new Date(
                    this.state.friendLastLoggedOut
                  ).toString()}`
                );
                console.log(
                  `${this.state.friend} last logged out ${
                    doc.data().lastLoggedOut
                  }`
                );
              }
            );
          });
      });
    }
  };

  submitMessage = (msg) => {
    console.log("SENDIGN MESSAGEAR");
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        // add the message to the message array in the db
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
          gifRef: null,
        }),
        receiverHasRead: false,
      });
    // this.selectChat(0);
  };

  submitGif = (url) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        // add the message to the message array in the db
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: null,
          timestamp: Date.now(),
          gifRef: url,
        }),
        receiverHasRead: false,
      });
    // this.selectChat(0);
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () => {
    this.setState({ newChatFormVisible: true, selectedChat: null });
  };

  messageRead = () => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log("Clicked message where the user was the sender");
    }
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find((_chat) =>
      usersInChat.every((_usr) => _chat.users.includes(_usr))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    // await this.selectChat(0);
    this.submitMessage(msg);
  };

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        messages: [
          {
            message: chatObj.message,
            sender: this.state.email,
            gifRef: chatObj.gifRef,
            timestamp: Date.now(),
          },
        ],
        users: [this.state.email, chatObj.sendTo],
        receiverHasRead: false,
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
    // this.selectChat(0);
  };

  clickedChatWhereNotSender = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  updateOnlineStatus = () => {
    console.log(this.state.email + " online: " + this.state.online);
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.email)
      .update({ online: this.state.online });
  };

  componentDidMount = () => {
    console.log("ejcena");
    document.title = "Jabber";
    // logging in, logging out, users being deleted, etc
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) {
        this.setState({ online: false }, () => {
          this.updateOnlineStatus();
          this.props.history.push("/login");
        });
      } else {
        // where is the query that asks for the document where the user's email is stored
        // onSnapshot() is a method that is called whenever the database document is updated
        // it returns a promise as server is involved which we can use async await with
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async (res) => {
            const chats = res.docs.map((_doc) => _doc.data());
            await this.setState(
              () => ({
                email: _usr.email,
                chats: chats,
              }),
              () => {
                if (this.state.chats)
                  this.setState({ online: true }, this.updateOnlineStatus);
                // select most recent chat by default
                // i guess it's not totally ideal as good UX would be to select
                // most recent READ message
                // but am fairly happy with this
                if (
                  this.state.selectedChat === null &&
                  this.state.chats.length > 0
                ) {
                  const chatsToOrder = [...this.state.chats];
                  const orderedChats = chatsToOrder.sort(
                    (a, b) =>
                      b.messages[b.messages.length - 1].timestamp -
                      a.messages[a.messages.length - 1].timestamp
                  );
                  // console.log(this.state.chats);
                  // console.log(orderedChats);
                  const startIndex = this.state.chats.findIndex(
                    (element) => element === orderedChats[0]
                  );
                  // console.log("startIndex = ", startIndex);
                  this.selectChat(startIndex);
                }
              }
            );
          });
      }
    });
  };
}

export default withStyles(styles)(DashboardComponent);
