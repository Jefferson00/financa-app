import { ICreateAccount } from '../../../../interfaces/Account';
import api from '../../../../services/api';
import {
  addAccount,
  addAccounts,
  updateAccountState,
  removeAccountState,
  changeLoadingState,
} from '..';
import { addMessage } from '../../Feedbacks';
import { checkApiError } from '../../../../utils/checkApiError';

export const listAccounts = (userId: string) => {
  return (dispatch: any) => {
    dispatch(changeLoadingState(true));
    api
      .get(`accounts/active/user/${userId}`)
      .then(res => {
        dispatch(addAccounts(res.data));
      })
      .catch(e => {
        dispatch(changeLoadingState(false));
        dispatch(
          addMessage({
            type: 'error',
            message: checkApiError(e),
          }),
        );
      });
  };
};

export const createAccount = (account: ICreateAccount) => {
  return (dispatch: any) => {
    dispatch(changeLoadingState(true));
    api
      .post(`accounts`, account)
      .then(res => {
        dispatch(addAccount(res.data));

        dispatch(
          addMessage({
            type: 'success',
            message: 'Conta criada com sucesso!',
          }),
        );
      })
      .catch(e => {
        dispatch(changeLoadingState(false));
        dispatch(
          addMessage({
            type: 'error',
            message: checkApiError(e),
          }),
        );
      });
  };
};

export const updateAccount = (account: any, accountId: string) => {
  return (dispatch: any) => {
    dispatch(changeLoadingState(true));
    api
      .put(`accounts/${accountId}`, account)
      .then(res => {
        dispatch(updateAccountState(res.data));

        dispatch(
          addMessage({
            type: 'success',
            message: 'Conta atualizada com sucesso!',
          }),
        );
      })
      .catch(e => {
        dispatch(changeLoadingState(false));
        dispatch(
          addMessage({
            type: 'error',
            message: checkApiError(e),
          }),
        );
      });
  };
};

export const deleteAccount = (accountId: string, userId: string) => {
  return (dispatch: any) => {
    dispatch(changeLoadingState(true));
    api
      .delete(`accounts/${accountId}/${userId}`)
      .then(res => {
        dispatch(removeAccountState(accountId));

        dispatch(
          addMessage({
            type: 'success',
            message: 'Conta excluída',
          }),
        );
      })
      .catch(e => {
        dispatch(changeLoadingState(false));
        dispatch(
          addMessage({
            type: 'error',
            message: checkApiError(e),
          }),
        );
      });
  };
};
