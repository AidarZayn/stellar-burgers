import { configureStore } from '@reduxjs/toolkit';
import { mainReducer } from './mainReducer';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export type RootState = ReturnType<typeof mainReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

const store = configureStore({
  reducer: mainReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
