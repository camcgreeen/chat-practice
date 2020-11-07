import { yellow } from "@material-ui/core/colors";

const styles = (theme) => ({
  content: {
    height: "calc(100vh - 100px)",
    overflow: "auto",
    padding: "25px",
    marginLeft: "25%",
    boxSizing: "border-box",
    overflowY: "scroll",
    top: "50px",
    width: "75%",
    position: "absolute",
    // scrollBehavior: "smooth",
  },

  name: {
    // position: "absolute",
    position: "relative",
    margin: 0,
    padding: 0,
  },

  pp: {
    position: "relative",
    margin: 0,
    padding: 0,
  },

  messageContainer: {
    padding: "10px",
    backgroundColor: "pink",
  },

  userSent: {
    float: "right",
    clear: "both",
    padding: "20px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "10px",
    backgroundColor: "#707BC4",
    color: "white",
    // width: "300px",
    // minWidth: "150px",
    maxWidth: "80%",
    // borderRadius: "10px",
    borderRadius: "25px 25px 0px 25px",
  },

  friendSent: {
    float: "left",
    clear: "both",
    padding: "20px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "10px",
    paddingTop: "20px",
    backgroundColor: "#dbdbdb",
    color: "black",
    // width: "300px",
    maxWidth: "80%",
    // borderRadius: "10px",
    borderRadius: "25px 25px 25px 0px",
  },

  message: {
    // color: "yellow",
    marginTop: "10px",
  },

  readReceipt: {
    float: "right",
    clear: "both",
    fill: "#707BC4",
    opacity: "0.75",
    width: "25px",
    margin: 0,
    padding: 0,
    marginTop: "10px",
    // padding: "20px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    // marginTop: "10px",
    // backgroundColor: "#dbdbdb",
    color: "black",
    // width: "300px",
    // maxWidth: "80%",
    borderRadius: "10px",
  },

  readReceipt2: {
    position: "absolute",
    // left: "20%",
    // float: "right",
    // clear: "both",
    fill: "#707BC4",
    opacity: "0.75",
    // width: "25px",
    margin: 0,
    padding: 0,
    // marginTop: "20px",
    // padding: "20px",
    boxSizing: "border-box",
    // wordWrap: "break-word",
    // marginTop: "10px",
    backgroundColor: "white",
    color: "black",
    // width: "300px",
    // maxWidth: "80%",
    // borderRadius: "10px",
  },

  chatHeader: {
    width: "calc(75% + 1px)",
    height: "50px",
    backgroundColor: "#344195",
    position: "fixed",
    marginLeft: "calc(25% + 1px)",
    fontSize: "18px",
    textAlign: "center",
    color: "white",
    paddingTop: "12.5px",
    boxSizing: "border-box",
  },

  gif: {},
});

export default styles;
