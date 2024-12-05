import { ChangeEvent, SyntheticEvent } from 'react';

export type RegisterUIProps = {
  email: string;
  password: string;
  userName: string;
  errorText?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
