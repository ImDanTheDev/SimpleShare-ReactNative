import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'info' | 'warn' | 'error';
export interface IToast {
    id?: number;
    type: ToastType;
    message: string;
    duration: number;
    timer?: NodeJS.Timer;
}

export interface ToasterState {
    toasts: IToast[];
    nextToastId: number;
}

const initialState: ToasterState = {
    toasts: [],
    nextToastId: 0,
};

export const toasterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        pushToast: (state, action: PayloadAction<IToast>) => {
            state.toasts.push({ ...action.payload, id: state.nextToastId++ });
        },
        setTimer: (
            state,
            action: PayloadAction<{ id: number; timer: NodeJS.Timer }>
        ) => {
            const toast = state.toasts.find((t) => t.id === action.payload.id);
            if (!toast) {
                console.log('Could not find a toast to set a timer for.');
                return;
            }

            toast.timer = action.payload.timer;
        },
        ageToast: (state, action: PayloadAction<IToast>) => {
            const toast = state.toasts.find((t) => t.id === action.payload.id);
            if (!toast) {
                console.log('Could not find toast to update');
                return;
            }
            toast.duration--;
        },
        dismissToast: (state, action: PayloadAction<IToast>) => {
            state.toasts = state.toasts.filter(
                (t) => t.id !== action.payload.id
            );
        },
    },
});

export const { pushToast, setTimer, ageToast, dismissToast } =
    toasterSlice.actions;
export default toasterSlice.reducer;
