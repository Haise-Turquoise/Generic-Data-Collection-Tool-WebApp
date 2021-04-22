import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const IdleTimeOutModal = ({ showModal, handleClose, handleLogout }) => {

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>You Have Been Idle!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You will be expired soon. Click stay to continue your session.</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
            </Button>
                <Button variant="primary" onClick={handleClose}>
                    Stay
            </Button>
            </Modal.Footer>
        </Modal>
    )
}