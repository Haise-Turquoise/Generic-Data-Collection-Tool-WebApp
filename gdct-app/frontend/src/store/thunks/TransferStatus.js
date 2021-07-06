import TransferStatusStore from '../TransferStatusStore/store';
import TransferStatusController from '../../controllers/TransferStatus';

export const startTransferRequest = minutes => dispatch => {
  dispatch(TransferStatusStore.actions.REQUEST());

  TransferStatusController.startTransfer(minutes)
    .then(res => {
      dispatch(TransferStatusStore.actions.RECEIVE(res));
    })
    .catch(error => {
      dispatch(TransferStatusStore.actions.FAIL_REQUEST(error));
    });
};

export const stopTransferRequest = () => dispatch => {
  dispatch(TransferStatusStore.actions.REQUEST());

  TransferStatusController.stopTransfer()
    .then(res => {
      dispatch(TransferStatusStore.actions.RECEIVE(res));
    })
    .catch(error => {
      dispatch(TransferStatusStore.actions.FAIL_REQUEST(error));
    });
};
