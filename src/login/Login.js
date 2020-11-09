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
                      timestamp: 1604835773386,
                    },
                    {
                      gifRef: null,
                      message:
                        "Welcome to APP_NAME, a full stack chat application built with React and Firebase",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604835800000,
                    },
                    {
                      gifRef:
                        "https://media3.giphy.com/media/SRlLBrVq3YL5TzIuuG/giphy.gif?cid=054422c3641b6rgvp84jzpz3ff4ojg5f119wi4djqu501one&rid=giphy.gif",
                      message: null,
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604835800000,
                    },
                    {
                      gifRef: null,
                      message: "I'm Cam Green, the creator of this app",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604835800000,
                    },
                    {
                      gifRef: null,
                      message:
                        "I have included some dummy chats to show you the functionality of the app as it turns out it’s quite hard to demo a chat application without lots of users!",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604835850000,
                    },
                    {
                      gifRef: null,
                      message:
                        "Click on one these chats in the chat list to the side or send a nice message to a friend using their email address with the ‘New Message’ button",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604835900000,
                    },
                    {
                      gifRef: null,
                      message:
                        "You can find the link to the GitHub repo here: https://github.com/camcgreen/chat-practice",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604835950000,
                    },
                    {
                      gifRef: null,
                      message:
                        "Feel free to contact me right here, or on my email address mailto:c.c.green@outlook.com, and I will get back to you as soon as possible! 😀",
                      receiverRead: false,
                      sender: camEmail,
                      timestamp: 1604836100000,
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
                    console.log("LOGGING IN");
                    this.props.history.push("/dashboard");
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
