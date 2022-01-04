import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { KModal } from '@ui/KModal/KModal';
import { AppState } from '@core/redux/store';
import { EditForm } from '@components/DomainsPage/DomainsLayout/EditForm/EditForm';
import { DomainSchema } from '@components/DomainsPage/DomainsLayout/EditForm/schema/DomainSchema';
import { KForm2 } from '@ui/KForm2/KForm2';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';
import { formatCampaignList } from '@components/DomainsPage/helpers';
import { FormikHelpers } from 'formik';
import { WindowServiceContext } from '@components/DomainsPage/WindowService/WindowServiceContext';
import { ServerValidationError } from '@core/api/errrors/ServerValidationError';
import { Footer } from './Footer/Footer';

type Props = {
  onCancel: () => void;
};
export const CreateWindow: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const campaignOptions = useSelector((state: AppState) => state.global.resources.campaignOptions);
  const campaigns = formatCampaignList(campaignOptions);
  const { createDomain } = useContext(WindowServiceContext);

  const initialValues: DomainCreation = {
    name: '',
    sslRedirect: false,
    wildcard: false,
    catchNotFound: false,
    campaigns,
    allowIndexing: true,
    defaultCampaignId: '',
  };

  const handleOnSubmit = async (values: DomainCreation, helpers: FormikHelpers<DomainCreation>) => {
    const { error } = await createDomain(values);
    const { setErrors } = helpers;

    if (error && error instanceof ServerValidationError) {
      setErrors(error.getPayload());
    }
  };

  return (
    <KModal title={t('domains.creating')} size="lg" onHide={onCancel}>
      <KForm2 initialValues={initialValues} onSubmit={handleOnSubmit} validationSchema={DomainSchema}>
        <KModal.Body>
          <EditForm />
        </KModal.Body>

        <KModal.Footer>
          <Footer onCancel={onCancel} />
        </KModal.Footer>
      </KForm2>
    </KModal>
  );
};
