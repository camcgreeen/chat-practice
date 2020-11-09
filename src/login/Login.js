import { Link } from "react-router-dom";
import React from "react";
import styles from "./styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const firebase = require("firebase");

class LoginComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      loginError: "",
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography components="h1" variant="h5">
            Log in
          </Typography>
          <form className={classes.form} onSubmit={(e) => this.submitLogin(e)}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-email-input">
                Enter your email
              </InputLabel>
              <Input
                autoComplete="email"
                autoFocus
                id="login-email-input"
                onChange={(e) => this.userTyping("email", e)}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-password-input">
                Enter your password
              </InputLabel>
              <Input
                type="password"
                id="login-password-input"
                onChange={(e) => this.userTyping("password", e)}
              ></Input>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log in
            </Button>
          </form>
          <Typography components="h1" variant="h6">
            Or
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.createAndLoginDemoUser}
          >
            Log in as a demo user
          </Button>
          {this.state.loginError && (
            <Typography
              className={classes.errorText}
              component="h5"
              variant="h6"
            >
              {this.state.loginError}
            </Typography>
          )}
          <Typography
            component="h5"
            variant="h6"
            className={classes.noAccountHeader}
          >
            Don't have an account?
          </Typography>
          <Link className={classes.signUpLink} to="/signup">
            Sign up
          </Link>
        </Paper>
      </main>
    );
  }

  userTyping = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;
      case "password":
        this.setState({ password: e.target.value });
        break;
      default:
        break;
    }
  };

  createAndLoginDemoUser = async () => {
    const demoUser = this.generateRandomString(10);
    const demoEmail = `${demoUser}@gmail.com`;
    const demoPassword = "thisisademo";
    await this.setState({ email: demoEmail, password: demoPassword });
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.email.toLowerCase(),
        this.state.password
      )
      .then(
        (authRes) => {
          console.log("authRes = ", authRes);
          const userObj = {
            email: authRes.user.email,
            firstName: "Demo",
            lastName: "User",
            lastLoggedOut: null,
            online: false,
          };
          // this is the bit where we add the user to our database
          // this is separate to firebase authentication bit
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(userObj)
            .then(
              () => {
                const camEmail = "c.c.green@outlook.com";
                const chatCamUsers = [camEmail, this.state.email].sort();
                const chatCamDocKey = chatCamUsers.join(":");
                console.log(`chatCamDocKey = ${chatCamDocKey}`);
                const chatCamObj = {
                  messages: [
                    {
                      gifRef: null,
                      message: "Hey there! 👋",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 7,
                    },
                    {
                      gifRef: null,
                      message:
                        "Welcome to APP_NAME, a full stack chat application built with React and Firebase",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 6,
                    },
                    {
                      gifRef:
                        "https://media3.giphy.com/media/SRlLBrVq3YL5TzIuuG/giphy.gif?cid=054422c3641b6rgvp84jzpz3ff4ojg5f119wi4djqu501one&rid=giphy.gif",
                      message: null,
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 5,
                    },
                    {
                      gifRef: null,
                      message: "I'm Cam Green, the creator of this app",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 4,
                    },
                    {
                      gifRef: null,
                      message:
                        "I have included some dummy chats to show you the functionality of the app as it turns out it’s quite hard to demo a chat application without lots of users!",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 3,
                    },
                    {
                      gifRef: null,
                      message:
                        "Click on one these chats in the chat list to the side or send a nice message to a friend using their email address with the ‘New Message’ button",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 2,
                    },
                    {
                      gifRef: null,
                      message:
                        "You can find the link to the GitHub repo here: https://github.com/camcgreen/chat-practice",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now() - 60000 * 1,
                    },
                    {
                      gifRef: null,
                      message:
                        "Feel free to contact me right here, or on my email address mailto:c.c.green@outlook.com, and I will get back to you as soon as possible! 😀",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: Date.now(),
                    },
                  ],
                  receiverHasRead: false,
                  user1Typing: false,
                  user2Typing: false,
                  users: chatCamUsers,
                };
                console.log("setting up chat with Cam", chatCamObj);
                firebase
                  .firestore()
                  .collection("chats")
                  .doc(chatCamDocKey)
                  .set({ ...chatCamObj })
                  .then(() => {
                    const janeEmail = "jane.doe@gmail.com";
                    const chatJaneUsers = [janeEmail, this.state.email].sort();
                    const chatJaneDocKey = chatJaneUsers.join(":");
                    const chatJaneObj = {
                      messages: [
                        {
                          gifRef: null,
                          message:
                            "I'm here to tell you that you can send emojis with the emoji button, like this:",
                          receiverRead: false,
                          sender: janeEmail,
                          timestamp: Date.now() - 60000 * 23,
                        },
                        {
                          gifRef: null,
                          message: "😁😁😁",
                          receiverRead: false,
                          sender: janeEmail,
                          timestamp: Date.now() - 60000 * 22,
                        },
                        {
                          gifRef: null,
                          message:
                            "You can send GIFs with the GIF icon button, using the Giphy API",
                          receiverRead: false,
                          sender: janeEmail,
                          timestamp: Date.now() - 60000 * 21,
                        },
                        {
                          gifRef:
                            "https://media0.giphy.com/media/8Iv5lqKwKsZ2g/giphy.gif?cid=054422c3esjdb7maxup41cz0uudxss9dcpn41a9h97r4b5vu&rid=giphy.gif",
                          message: null,
                          receiverRead: false,
                          sender: janeEmail,
                          timestamp: Date.now() - 60000 * 20,
                        },
                      ],
                      receiverHasRead: false,
                      user1Typing: false,
                      user2Typing: false,
                      users: chatJaneUsers,
                    };
                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(chatJaneDocKey)
                      .set({ ...chatJaneObj })
                      .then(() => {
                        const tyriqueEmail = "tyrique.bellamy@gmail.com";
                        const chatTyriqueUsers = [
                          tyriqueEmail,
                          this.state.email,
                        ].sort();
                        const chatTyriqueDocKey = chatTyriqueUsers.join(":");
                        const chatTyriqueObj = {
                          messages: [
                            {
                              gifRef: null,
                              message:
                                "To show you the *other user is typing* feature, my isTyping flag has been set to true for the rest of eternity",
                              receiverRead: false,
                              sender: tyriqueEmail,
                              timestamp: Date.now() - 60000 * 27,
                            },
                            {
                              gifRef: null,
                              message: "Tiring!",
                              receiverRead: false,
                              sender: tyriqueEmail,
                              timestamp: Date.now() - 60000 * 26,
                            },
                            {
                              gifRef: null,
                              message: "Below is the typing indicator 👇",
                              receiverRead: false,
                              sender: tyriqueEmail,
                              timestamp: Date.now() - 60000 * 25,
                            },
                          ],
                          receiverHasRead: false,
                          user1Typing: true,
                          user2Typing: true,
                          users: chatTyriqueUsers,
                        };
                        firebase
                          .firestore()
                          .collection("chats")
                          .doc(chatTyriqueDocKey)
                          .set({ ...chatTyriqueObj })
                          .then(() => {
                            const amaraEmail = "amara.khan@gmail.com";
                            const chatAmaraUsers = [
                              amaraEmail,
                              this.state.email,
                            ].sort();
                            const chatAmaraDocKey = chatAmaraUsers.join(":");
                            const chatAmaraObj = {
                              messages: [
                                {
                                  gifRef: null,
                                  message:
                                    "You're probably about sick of these hard-coded one way conversations by now!",
                                  receiverRead: false,
                                  sender: amaraEmail,
                                  timestamp: Date.now() - 60000 * 106,
                                },
                                {
                                  gifRef: null,
                                  message:
                                    "Don't worry, we're almost done, just one more thing to show you",
                                  receiverRead: false,
                                  sender: amaraEmail,
                                  timestamp: Date.now() - 60000 * 105,
                                },
                                {
                                  gifRef: null,
                                  message:
                                    "APP_NAME includes a read receipt system, which I will demonstrate for you now",
                                  receiverRead: false,
                                  sender: amaraEmail,
                                  timestamp: Date.now() - 60000 * 104,
                                },
                                {
                                  gifRef: null,
                                  message:
                                    "I’ve added a message from you below for me to read",
                                  receiverRead: false,
                                  sender: amaraEmail,
                                  timestamp: Date.now() - 60000 * 103,
                                },
                                {
                                  gifRef: null,
                                  message: "Hey, read this message!",
                                  receiverRead: true,
                                  sender: this.state.email,
                                  timestamp: Date.now() - 60000 * 102,
                                },
                                {
                                  gifRef: null,
                                  message:
                                    "I have read your message. You will see an eye icon underneath it to indicate that I have seen it.",
                                  receiverRead: false,
                                  sender: amaraEmail,
                                  timestamp: Date.now() - 60000 * 101,
                                },
                                {
                                  gifRef: null,
                                  message:
                                    "I promise not to read your next message! If you send me another one, you will see that the icon stays in place as I will not have read it 👆",
                                  receiverRead: false,
                                  sender: amaraEmail,
                                  timestamp: Date.now() - 60000 * 100,
                                },
                              ],
                              receiverHasRead: false,
                              user1Typing: false,
                              user2Typing: false,
                              users: chatAmaraUsers,
                            };
                            firebase
                              .firestore()
                              .collection("chats")
                              .doc(chatAmaraDocKey)
                              .set({ ...chatAmaraObj })
                              .then(() => {
                                const chelseaEmail = "chelsea.parkes@gmail.com";
                                const chatChelseaUsers = [
                                  chelseaEmail,
                                  this.state.email,
                                ].sort();
                                const chatChelseaDocKey = chatChelseaUsers.join(
                                  ":"
                                );
                                const chatChelseaObj = {
                                  messages: [
                                    {
                                      gifRef: null,
                                      message:
                                        "Hi there, I'm Chelsea, a made up person!",
                                      receiverRead: false,
                                      sender: chelseaEmail,
                                      timestamp:
                                        Date.now() - 3600000 * 25 - 60000 * 2,
                                    },
                                    {
                                      gifRef: null,
                                      message:
                                        "I wanted to let you know about timestamps 🤓",
                                      receiverRead: false,
                                      sender: chelseaEmail,
                                      timestamp:
                                        Date.now() - 3600000 * 25 - 60000 * 1,
                                    },
                                    {
                                      gifRef: null,
                                      message:
                                        "Timestamps above messages change dynamically depending on when they were sent",
                                      receiverRead: false,
                                      sender: chelseaEmail,
                                      timestamp: Date.now() - 60000 * 13,
                                    },
                                    {
                                      gifRef: null,
                                      message:
                                        "Older messages’ timestamps will display in month day year format, whereas messages sent in the last 24 hours will be displayed in hh:mm format",
                                      receiverRead: false,
                                      sender: chelseaEmail,
                                      timestamp: Date.now() - 60000 * 12,
                                    },
                                    {
                                      gifRef: null,
                                      message:
                                        "The chat list on the side behaves similarly, too!",
                                      receiverRead: false,
                                      sender: chelseaEmail,
                                      timestamp: Date.now() - 60000 * 11,
                                    },
                                    {
                                      gifRef: null,
                                      message:
                                        "This hopefully provides a more convenient user experience 😊",
                                      receiverRead: false,
                                      sender: chelseaEmail,
                                      timestamp: Date.now() - 60000 * 10,
                                    },
                                  ],
                                  receiverHasRead: false,
                                  user1Typing: false,
                                  user2Typing: false,
                                  users: chatChelseaUsers,
                                };
                                firebase
                                  .firestore()
                                  .collection("chats")
                                  .doc(chatChelseaDocKey)
                                  .set({ ...chatChelseaObj })
                                  .then(() => {
                                    this.props.history.push("/dashboard");
                                  });
                              });
                          });
                      });
                  });
                // this routes us to the dashboard once we've successfully signed up
                // await firebase
                //   .firestore()
                //   .collection("chats")
                //   .doc(docKey)
                //   .set({
                //     messages: [
                //       {
                //         message: chatObj.message,
                //         sender: this.state.email,
                //         gifRef: chatObj.gifRef,
                //         timestamp: Date.now(),
                //         receiverRead: false,
                //       },
                //     ],
                //     users: [this.state.email, chatObj.sendTo].sort(),
                //     receiverHasRead: false,
                //     user1Typing: false,
                //     user2Typing: false,
                //   });
                // this.setState({ newChatFormVisible: false });
                // this.selectChat(this.state.chats.length - 1);
                // this.props.history.push("/dashboard");
              },
              (dbError) => {
                console.log(dbError);
                this.setState({ signupError: "Failed to add user" });
              }
            );
        },
        (authError) => {
          console.log(authError);
          this.setState({ signupError: authError.message });
        }
      );
  };

  generateRandomString = (length) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = length; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  };

  submitLogin = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.email.toLowerCase(),
        this.state.password
      )
      .then(
        () => {
          // const user = firebase.auth().currentUser;
          // user
          //   .sendEmailVerification()
          //   .then(() => {
          //     // console.log("authRes", authRes);
          //     console.log("Email verification link sent to");
          //   })
          //   .catch((err) => console.log(err));
          this.props.history.push("/dashboard");
        },
        (err) => {
          this.setState({ loginError: err.message });
          console.log(err);
        }
      );
  };
}

export default withStyles(styles)(LoginComponent);
