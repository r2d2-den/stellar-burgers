import { ChangeEvent, SyntheticEvent } from 'react';

export type ResetPasswordUIProps = {
  password: string;
  token: string;
  errorText?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
