import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from './slices/user';
import { orderSlice } from './slices/orders';
import { feedSlice } from './slices/feeds';
import { ingredientsSlice } from './slices/ingredients';
import { constructorSlice } from './slices/burger-constructor';

export const mainReducer = combineReducers({
  user: userSlice.reducer,
  orders: orderSlice.reducer,
  feeds: feedSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer
});
