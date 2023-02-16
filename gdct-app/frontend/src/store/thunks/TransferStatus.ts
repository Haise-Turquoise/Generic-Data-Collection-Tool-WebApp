import TransferStatusStore from '../TransferStatusStore/store';
import TransferStatusController from '../../controllers/TransferStatus';
import { Dispatch } from 'redux';

export const startTransferRequest = (minutes: string) => (dispatch: Dispatch) => {
  dispatch(TransferStatusStore.actions.REQUEST(''));

  TransferStatusController.setTransfer(minutes)
    .then((res:any) => {
      dispatch(TransferStatusStore.actions.RECEIVE(res));
    })
    .catch(error => {
      dispatch(TransferStatusStore.actions.FAIL_REQUEST(error));
    });
};

export const stopTransferRequest = () => (dispatch: Dispatch) => {
  dispatch(TransferStatusStore.actions.REQUEST(''));

  TransferStatusController.stopTransfer()
    .then((res:any) => {
      dispatch(TransferStatusStore.actions.RECEIVE(res));
    })
    .catch(error => {
      dispatch(TransferStatusStore.actions.FAIL_REQUEST(error));
    });
};
