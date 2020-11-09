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
      lastLoggedOut: null,
      friendLastLoggedOut: "",
      friendFirstName: null,
      friendLastName: null,
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
            friend={this.state.friend}
            chat={this.state.chats[this.state.selectedChat]}
            friendOnline={this.state.friendOnline}
            friendLastLoggedOut={this.state.friendLastLoggedOut}
            updateUserInfoFn={this.updateUserInfo}
            friendFirstName={this.state.friendFirstName}
            friendLastName={this.state.friendLastName}
          ></ChatViewComponent>
        )}
        {this.state.chats.length > 0 &&
        this.state.selectedChat !== null &&
        !this.state.newChatFormVisible ? (
          <ChatTextBoxComponent
            submitMessageFn={this.submitMessage}
            submitGifFn={this.submitGif}
            messageReadFn={this.messageRead}
            email={this.state.email}
            friend={this.state.friend}
            selectChatFn={this.selectChat}
            selectedChatIndex={this.state.selectedChat}
            // onClick={() => this.messageRead(this.state.friend)}
            // onClick={() => this.selectChat(this.state.selectedChat)}
            // onClick={console.log(`focused chat with ${this.state.friend}`)}
            // users={[this.state.email, this.state.friend]}
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
    console.log("SIGNING OUT of account", this.state.email);
    this.setState({ lastLoggedOut: Date.now() }, async () => {
      await firebase
        .firestore()
        .collection("users")
        .doc(this.state.email)
        .update({ lastLoggedOut: this.state.lastLoggedOut });
      // console.log("logged out at: ", this.state.lastLoggedOut);
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
    // console.log(chat.exists);
    return chat.exists;
  };

  // getFriendName = (friend) => {
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(friend)
  //     .get()
  //     .then((doc) => {
  //       const data = doc.data();
  //       this.setState({
  //         friendFirstName: data.firstName,
  //         friendLastName: data.lastName,
  //       });
  //     });
  // .then((doc) => {
  // console.log("getting user data...");
  // const data = doc.data();
  // console.log(`data for user ${friend} =`, data);
  // this.setState({
  //   friendFirstName: data.firstName,
  //   friendLastName: data.lastName,
  // });
  // )}
  // return [data.firstName, data.lastName];
  // };

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    const friend = this.state.chats[this.state.selectedChat].users.filter(
      (_usr) => _usr !== this.state.email
    )[0];
    // this.getFriendName(friend);
    this.messageRead(friend);
    if (this.state.chats.length > 0) {
      // const friend = this.state.chats[this.state.selectedChat].users.filter(
      //   (_usr) => _usr !== this.state.email
      // )[0];
      this.setState({ friend }, () => {
        console.log(
          `Selected chat ${this.state.selectedChat} with friend ${this.state.friend}`
        );
        firebase
          .firestore()
          .collection("users")
          .doc(this.state.friend)
          .onSnapshot((doc) => {
            // console.log("doc.data() = ", doc.data());
            this.setState(
              {
                friendOnline: doc.data().online,
                friendLastLoggedOut: doc.data().lastLoggedOut,
              },
              () => {
                // console.log("prevState", this.state.prevChats);
                // console.log("state", this.state);
                // console.log(
                //   `${this.state.friend} last logged out ${new Date(
                //     this.state.friendLastLoggedOut
                //   ).toString()}`
                // );
                // console.log(
                //   `${this.state.friend} last logged out ${
                //     doc.data().lastLoggedOut
                //   }`
                // );
              }
            );
          });
      });
    }
  };

  submitMessage = (msg) => {
    // console.log("SENDIGN MESSAGEAR");
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
          receiverRead: false,
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
          receiverRead: false,
        }),
        receiverHasRead: false,
      });
    // this.selectChat(0);
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () => {
    this.setState({ newChatFormVisible: true, selectedChat: null });
  };

  messageRead = (friend) => {
    // if (friend) {
    //   console.log("reading emssage");
    console.log("reading message from", friend);
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      // let obj = JSON.parse(
      //   JSON.stringify(this.state.chats[this.state.selectedChat])
      // );
      // console.log(obj);
      // let arr = [...obj.messages];
      // if (Array.isArray(this.state.chats[this.state.selectedChat].messages)) {
      //   console.log("aaaawhaaaataa");
      //   // let obj = JSON.parse(
      //   //   JSON.stringify(this.state.chats[this.state.selectedChat])
      //   // );
      //   // console.log(obj);
      //   // let arr = [...obj.messages];
      //   arr.forEach((message) => {
      //     if (message.sender === friend) {
      //       message.receiverRead = true;
      //     }
      //   });
      //   console.log(arr);
      // }

      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
      // .update({ receiverHasRead: true, messages: arr });

      // console.log("CHATA = ", this.state.chats[this.state.selectedChat]);
    } else {
      console.log("Clicked message where the user was the sender");
    }

    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get()
      .then((doc) => {
        const chatCopy = doc.data();
        let messages = chatCopy.messages;
        messages.forEach((msg) => {
          if (msg.sender === friend) {
            msg.receiverRead = true;
          }
        });
        firebase
          .firestore()
          .collection("chats")
          .doc(docKey)
          .update({ messages });
        console.log("doc =", chatCopy);
      });
    // const chatCopyMessages = chatCopy.data().messages;
    // console.log("chatCopy", chatCopy);
    // chatCopyMessages.forEach((msg) => (msg.receiverRead = true));
    // console.log("chatCopy", chatCopyMessages);

    // firebase
    //   .firestore()
    //   .collection("chats")
    //   .doc(docKey)
    //   .update(messages.forEach((msg) => (msg.receiverRead = true)));

    const obj = JSON.parse(
      JSON.stringify(this.state.chats[this.state.selectedChat])
    );
    let messages = [...obj.messages];

    console.log("CHAT = ", this.state.chats[this.state.selectedChat]);
    // const chatDeepCopy = { ...this.state.chats[this.state.selectedChat] };
    // const chatDeepCopy = JSON.parse(
    //   JSON.stringify(this.state.chats[this.state.selectedChat])
    // );
    // this.setState({chats[this.state.selectedChat]: })
    // chatDeepCopy.messages.forEach((message) => {
    //   if (message.sender === friend) {
    //     message.receiverRead = true;
    //   }
    // });
    // const arr = this.state.chats[this.state.selectedChat];
    // if (Array.isArray(this.state.chats[this.state.selectedChat].messages)) {
    //   console.log("aaaawhaaaataa");
    //   let obj = JSON.parse(
    //     JSON.stringify(this.state.chats[this.state.selectedChat])
    //   );
    //   console.log(obj);
    //   let arr = [...obj.messages];
    //   arr.forEach((message) => {
    //     if (message.sender === friend) {
    //       message.receiverRead = true;
    //     }
    //   });
    //   console.log(arr);
    // }
    // }
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
            receiverRead: false,
          },
        ],
        users: [this.state.email, chatObj.sendTo].sort(),
        receiverHasRead: false,
        user1Typing: false,
        user2Typing: false,
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
    // console.log(this.state.email + " online: " + this.state.online);
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.email)
      .update({ online: this.state.online });
  };

  componentDidMount = () => {
    // console.log("ejcena");
    document.title = "Jabber";
    // logging in, logging out, users being deleted, etc
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) {
        this.setState({ online: false }, () => {
          this.updateOnlineStatus();
          this.props.history.push("/login");
        });
      } else {
        console.log("state = ", this.state);
        // where is the query that asks for the document where the user's email is stored
        // onSnapshot() is a method that is called whenever the database document is updated
        // it returns a promise as server is involved which we can use async await with
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async (res) => {
            const chats = res.docs.map((_doc) => _doc.data());
            console.log("CHATS FROM SNAPSHOT =", chats);
            await this.setState(
              () => ({
                email: _usr.email,
                chats: chats,
              }),
              () => {
                if (this.state.chats)
                  this.setState({ online: true }, this.updateOnlineStatus);
                // this is to mark chats as read when they're already selected and a message is received
                // also means that we don't need to manually select chat when message is sent or
                // when input box is focused
                if (this.state.selectedChat !== null)
                  this.selectChat(this.state.selectedChat);
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
                  console.log("STATE IS = ", this.state);
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
