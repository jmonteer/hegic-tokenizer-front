import React, { useContext, useState } from 'react'
import { Toast, ToastHeader, ToastBody, Spinner, Button} from 'reactstrap'
import { AppContext } from '../../context/App'

function StatusMsg() {
    const app = useContext(AppContext)

    return (
        <>
            <div className='statusMessage'>
                <Toast isOpen={app.statusMsg != ""}>
                    <ToastHeader icon={<Spinner size="sm" />}>
                        { app.statusMsgTitle }
                    </ToastHeader>
                    <ToastBody>
                        { app.statusMsg }
                        <br></br>
                        <br></br>
                        <Button size="sm" className="secondary-button" onClick={() => app.updateStatusMsg("","")}>CLOSE</Button>
                    </ToastBody>
                </Toast>
            </div>
        </>
    )
}

export default StatusMsg;