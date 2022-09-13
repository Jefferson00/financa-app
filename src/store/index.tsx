import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './modules/Accounts';
import incomesReducer from './modules/Incomes';
import creditCardReducer from './modules/CreditCards';
import expansesReducer from './modules/Expanses';
import feedbacksReducer from './modules/Feedbacks';

export default configureStore({
  reducer: {
    accounts: accountReducer,
    incomes: incomesReducer,
    creditCards: creditCardReducer,
    expanses: expansesReducer,
    feedbacks: feedbacksReducer,
  },
});
