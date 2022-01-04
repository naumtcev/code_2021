import React, { FC } from 'react';
import { Form } from 'react-bootstrap';

type Props = {
  isChecked?: boolean;
  defaultChecked?: boolean;
  onClick: () => void;
};
export const Checkbox: FC<Props> = ({ isChecked, onClick }) => {
  return (
    <label className="block">
      <Form.Check className="form-check-inline" checked={isChecked} onChange={onClick} />
    </label>
  );
};
