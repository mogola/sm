import { toast } from 'react-toastify';

const notify = (type, message) => {
    switch(type){
        case "success":
            notifySuccess(message)
        break;
        case "error":
            notifyEchec(message)
        break;
    }
}

const notifySuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

const notifyEchec = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export {
    notify
}