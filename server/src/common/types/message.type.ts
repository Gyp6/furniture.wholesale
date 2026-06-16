import { MESSAGE } from '../constants';

export type TMessage = typeof MESSAGE;
export type TMessageKeys = keyof TMessage;
export type TMessageValues = (typeof MESSAGE)[TMessageKeys];
