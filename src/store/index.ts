import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const appReducer = combineReducers({
  auth: authReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Parameters<typeof appReducer>[1],
) => {
  if (action.type === "global/clearState") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export const clearState = () => async (dispatch: AppDispatch) => {
  await persistor.purge();
  dispatch({ type: "global/clearState" });
};
