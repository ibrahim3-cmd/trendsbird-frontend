import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import "@/redux/features/auth/auth.api";
import "@/redux/features/user/user.api";
import "@/redux/features/role/role.api";
import "@/redux/features/permission/permission.api";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
