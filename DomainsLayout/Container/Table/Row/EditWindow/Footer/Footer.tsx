import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { KButton } from '@ui/KButton/KButton';
import { AppState } from '@core/redux/store';
import { useFormikContext } from 'formik';
import { Domain } from '@components/DomainsPage/models/Domain';

type Props = {
  onCancel: () => void;
};

export const Footer: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const isCheckingInProgress = useSelector((state: AppState) => state.domains.isCheckingInProgress);
  const { submitForm } = useFormikContext<Domain>();

  const handleSubClick = async () => {
    await submitForm();
  };

  return (
    <>
      <KButton variant="secondary" onClick={onCancel}>
        {t('forms.cancel')}
      </KButton>
      <KButton
        variant="success"
        type="submit"
        isLoading={isCheckingInProgress}
        disabled={isCheckingInProgress}
        onClick={handleSubClick}
      >
        {t('forms.edit')}
      </KButton>
    </>
  );
};
