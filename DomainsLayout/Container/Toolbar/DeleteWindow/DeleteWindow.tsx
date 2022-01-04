import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { KButton } from '@ui/KButton/KButton';
import { KModal } from '@ui/KModal/KModal';
import { useSelector } from 'react-redux';
import { AppState } from '@core/redux/store';

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
};

export const DeleteWindow: FC<Props> = ({ onCancel, onSubmit }) => {
  const { t } = useTranslation();
  const isCheckingInProgress = useSelector((state: AppState) => state.domains.isCheckingInProgress);

  return (
    <KModal onHide={onCancel} title={t('forms.confirmation')} size="sm">
      <KModal.Body>{t('entity_grid.confirmations.archive')}</KModal.Body>
      <KModal.Footer>
        <KButton variant="secondary" onClick={onCancel}>
          {t('forms.cancel')}
        </KButton>
        <KButton
          variant="success"
          isLoading={isCheckingInProgress}
          isDisabled={isCheckingInProgress}
          onClick={onSubmit}
        >
          {t('forms.yes')}
        </KButton>
      </KModal.Footer>
    </KModal>
  );
};
