const styles = (theme) => ({
  sendBtn: {
    color: "blue",
    cursor: "pointer",
    "&:hover": {
      color: "gray",
    },
  },
  emojiPicker: {
    position: "absolute",
    right: "10px",
    width: "1000px",
    color: "red !important",
  },
  emojiPickerBtn: {
    width: "100px",
    margin: "0px 20px",
  },
  gifPicker: {
    position: "absolute",
    right: "10px",
    width: "1000px",
    color: "red !important",
  },
  gifPickerBtn: {
    width: "100px",
    margin: "0px 20px",
  },
  chatTextBoxContainer: {
    position: "absolute",
    bottom: "15px",
    left: "calc(25% + 15px)",
    boxSizing: "border-box",
    overflow: "visible",
    width: "calc(100% - 25% - 50px)",
  },

  chatTextBox: {
    width: "calc(100% - 350px)",
  },
});

export default styles;
