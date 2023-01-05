import { toast } from 'react-toastify';

export const showToast = (text, type) => {
  switch(type) {
    case "error": 
    return toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    default: 
    console.warn(`Invalid toast type: ${type}`);
  }
};
