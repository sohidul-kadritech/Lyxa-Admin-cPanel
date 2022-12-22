import { toast } from "react-toastify";

export const successMsg = (msg, status) => {
  if (status === "success") {
    return toast.success(msg, {
      // position: "bottom-right",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else {
    return toast.warn(msg, {
      // position: "bottom-right",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};
