import React from "react";
import GlobalWrapper from "../GlobalWrapper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ConfirmDialog = ({
  isOpen,
  title,
  content,
  closeDialog,
  dispatchFunc,
  typeId,
  error,
  message
}) => {
  const dispatch = useDispatch();

  const confirmDelete = () => {
    dispatch(dispatchFunc(typeId));
    closeDialog();
    if (message) {
      if (message) {
        return toast.success(message, {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
      if (error) {
        return toast.warn(error, {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Dialog
            open={isOpen}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Cancel</Button>
              <Button onClick={confirmDelete} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ConfirmDialog;
