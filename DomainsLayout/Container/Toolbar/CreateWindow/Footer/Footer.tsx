import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { KButton } from '@ui/KButton/KButton';
import { AppState } from '@core/redux/store';
import { useFormikContext } from 'formik';
import { FormCheck } from '@ui/KForm/FormCheck/FormCheck';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';

type Props = {
  onCancel: () => void;
};

export const Footer: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const isCheckingInProgress = useSelector((state: AppState) => state.domains.isCheckingInProgress);
  const { submitForm, setFieldValue, resetForm, values } = useFormikContext<DomainCreation>();

  const handleSubmit = async () => {
    await submitForm();
    if (values.addAnotherOne) {
      resetForm();
      setFieldValue('sslRedirect', false);
      setFieldValue('wildcard', false);
      setFieldValue('addAnotherOne', true);
    }
  };

  return (
    <>
      <div className="m-0">
        <FormCheck
          id="addAnotherOne"
          type="checkbox"
          className="pl-5"
          label={t('forms.add_more')}
          checked={values.addAnotherOne || false}
          onChange={() => {
            setFieldValue('addAnotherOne', !values.addAnotherOne);
          }}
        />
      </div>
      <KButton variant="secondary" onClick={onCancel}>
        {t('forms.cancel')}
      </KButton>
      <KButton
        variant="success"
        type="submit"
        isLoading={isCheckingInProgress}
        disabled={isCheckingInProgress}
        onClick={handleSubmit}
      >
        {t('forms.create')}
      </KButton>
    </>
  );
};
