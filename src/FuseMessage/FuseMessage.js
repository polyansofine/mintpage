// import * as React from 'react';
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Slide from "@mui/material/Slide";
import * as Actions from "../store/actions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// function TransitionLeft(props) {
//   return <Slide {...props} direction="left" />;
// }

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

// function TransitionRight(props) {
//   return <Slide {...props} direction="right" />;
// }

// function TransitionDown(props) {
//   return <Slide {...props} direction="down" />;
// }

export default function FuseMessage() {
  const dispatch = useDispatch();
  const state = useSelector(({ fuseReducers }) => fuseReducers.message.state);
  const options = useSelector(
    ({ fuseReducers }) => fuseReducers.message.options
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(Actions.hideMessage());
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        {...options}
        open={state}
        TransitionComponent={TransitionUp}
        autoHideDuration={options.autoHideDuration}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={options.variant}
          sx={{ width: "100%" }}
        >
          <span style={{ fontFamily: "Open Sans" }}>{options.message}</span>
        </Alert>
      </Snackbar>
    </Stack>
  );
}
