import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const ExpiredModal = ({ showModal, handleLogout }) => {

    return (
        <Modal show={showModal}>
            <Modal.Header closeButton>
                <Modal.Title>You Have Been Idle!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You session is expired, please relogin.</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
            </Button>
            </Modal.Footer>
        </Modal>
    )
}