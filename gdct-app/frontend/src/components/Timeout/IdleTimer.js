import React from 'react'
import IdleTimer from 'react-idle-timer';
import { IdleTimeOutModal } from './TimeoutPrototype';
import { ExpiredModal } from './ExpirePrototype';
import PropTypes from 'prop-types';
import sessionController from '../../controllers/Session';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css'

class Layout extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            timeout: 1000 * 3100,
            showModal: false,
            isTimedOut: false,
        }

        this.idleTimer = null;
        this.onAction = this._onAction.bind(this)
        // this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    _onAction(e) {
        (async () => {
            await sessionController.touchCommand()
        })();
        this.setState({ isTimedOut: false })
        this.idleTimer.reset();
    }

    // _onActive(e) {
    //     (async () => {
    //         await sessionController.touchCommand()
    //     })();
    //     this.setState({ isTimedOut: false })
    // }

    _onIdle(e) {
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            this.props.history.push('/login')
        } else {
            this.setState({ showModal: true })
            //this.idleTimer.reset();
            this.setState({ isTimedOut: true })
        }
    }

    handleClose() {
        this.setState({ showModal: false });
        (async () => {
            await sessionController.touchCommand()
        })();
        this.idleTimer.reset();
    }

    handleLogout() {
        this.setState({ showModal: false })
        this.props.history.push('/login')
    }

    render() {
        return (
            <>
                <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    element={document}
                    // onActive={this.onActive}
                    onIdle={this.onIdle}
                    onAction={this.onAction}
                    debounce={250}
                    timeout={this.state.timeout}
                    events={['mousedown', 'keydown']}
                />

                <div className="">
                    <IdleTimeOutModal
                        showModal={this.state.showModal}
                        handleClose={this.handleClose}
                        handleLogout={this.handleLogout}
                    />
                </div>
            </>
        )
    }

}

Layout.propTypes = {
    match: PropTypes.any.isRequired,
    history: PropTypes.func.isRequired
}

export default Layout