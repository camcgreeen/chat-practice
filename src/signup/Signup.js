import React from "react";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import styles from "./styles";
const firebase = require("firebase");

class SignupComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      passwordConfirmation: null,
      firstName: null,
      lastName: null,
      signupError: "",
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up!
          </Typography>
          <form onSubmit={(e) => this.submitSignup(e)} className={classes.form}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-email-input">
                Enter your email
              </InputLabel>
              <Input
                autoComplete="email"
                autoFocus
                id="signup-email-input"
                onChange={(e) => this.userTyping("email", e)}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-input">
                Create a password
              </InputLabel>
              <Input
                type="password"
                onChange={(e) => this.userTyping("password", e)}
                id="signup-password-input"
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-confirmation-input">
                Confirm your password
              </InputLabel>
              <Input
                type="password"
                onChange={(e) => this.userTyping("passwordConfirmation", e)}
                id="signup-password-confirmation-input"
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-first-name-input">
                Enter your first name
              </InputLabel>
              <Input
                onChange={(e) => this.userTyping("firstName", e)}
                id="signup-first-name-input"
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-last-name-input">
                Enter your last name
              </InputLabel>
              <Input
                onChange={(e) => this.userTyping("lastName", e)}
                id="signup-last-name-input"
              ></Input>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
          {this.state.signupError && (
            <Typography
              className={classes.errorText}
              component="h5"
              variant="h6"
            >
              {this.state.signupError}
            </Typography>
          )}
          <Typography
            component="h5"
            variant="h6"
            className={classes.hasAccountHeader}
          >
            Already have an account?
          </Typography>
          <Link className={classes.logInLink} to="/login">
            Log in!
          </Link>
        </Paper>
      </main>
    );
  }

  formIsValid = () => this.state.password === this.state.passwordConfirmation;

  // rename this method as I originally thought it was intended for typing indicators
  // it's actually just to grab the user input
  userTyping = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;
      case "password":
        this.setState({ password: e.target.value });
        break;
      case "passwordConfirmation":
        this.setState({ passwordConfirmation: e.target.value });
        break;
      case "firstName":
        this.setState({ firstName: e.target.value });
        break;
      case "lastName":
        this.setState({ lastName: e.target.value });
        break;
      default:
        break;
    }
  };

  submitSignup = (e) => {
    e.preventDefault();

    if (!this.formIsValid()) {
      this.setState({ signupError: "Passwords do not match!" });
      return;
    }

    // this is the firebase authentication bit
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        (authRes) => {
          // console.log(authRes.user);
          // authRes.user
          //   .sendEmailVerification()
          //   .then((verification) => {
          //     console.log("authRes", authRes);
          //     console.log("verification", verification);
          //     console.log("Email verification link sent to");
          //   })
          //   .catch((err) => console.log(err));
          const userObj = {
            email: authRes.user.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            lastloggedOut: "",
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
                // this routes us to the dashboard once we've successfully signed up
                this.props.history.push("/dashboard");
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
}

// this adds the styles as a prop called classes (this.props.classes)
export default withStyles(styles)(SignupComponent);
