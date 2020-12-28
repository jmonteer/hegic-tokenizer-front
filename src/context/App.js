import { createContext } from 'react';

const AppContext = createContext({
    statusMsgTitle: "",
    statusMsg: "",
    updateStatusMsg: () => {},
    updateAndWait: () => {},
    updateData: () => {},
    reload: false
})

export {
    AppContext
};