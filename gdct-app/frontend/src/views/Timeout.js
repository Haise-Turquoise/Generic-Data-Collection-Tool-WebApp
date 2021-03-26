import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

//note: this is the temporary timeout notification without any kind of style changes, hasn't been applied to any file yet.

const TimeoutModal = () => {
    let [timeRemain, setTimeRemain] = useState(false);
    let [countdown, setCountdown] = useState(60);
    // How to decrease the timeRemain and countdown...
    useEffect(() => {
        setTimeout(() => {
            setTimeRemain(true);
        }, 540 * 1000)
    })
    return (
        <Modal isOpen={timeRemain} contentLabel="timeout">
            <h3>You're about to timeout in: {countdown} seconds, please give an action to continue your current session.</h3>
            <button onClick={() => window.location.reload()}>Refresh</button>
        </Modal>
    )
}


export default TimeoutModal;