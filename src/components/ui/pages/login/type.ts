import { Dispatch, SetStateAction, ChangeEvent, SyntheticEvent } from 'react';

export type LoginUIProps = {
  email: string;
  password: string;
  errorText?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
