import { createAction, createReducer } from '@reduxjs/toolkit';

export interface MessageType {
  type: 'success' | 'info' | 'warning' | 'error' | 'default';
  message: string;
}

export interface FeedbackState {
  messages: MessageType | null;
}

const INITIAL_STATE: FeedbackState = {
  messages: null,
};

export const addMessage = createAction<MessageType>('ADD_MESSAGE');
export const removeMessage = createAction('REMOVE_MESSAGE');

export default createReducer(INITIAL_STATE, {
  [addMessage.type]: (state, action) => ({
    ...state,
    messages: action.payload,
  }),
  [removeMessage.type]: (state, action) => ({
    ...state,
    messages: null,
  }),
});
