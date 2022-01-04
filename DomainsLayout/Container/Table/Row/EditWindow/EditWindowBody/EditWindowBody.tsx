import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { KModal } from '@ui/KModal/KModal';
import { AppState } from '@core/redux/store';

import { EditForm } from '@components/DomainsPage/DomainsLayout/EditForm/EditForm';
import { KForm2 } from '@ui/KForm2/KForm2';
import { DomainSchema } from '@components/DomainsPage/DomainsLayout/EditForm/schema/DomainSchema';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';
import { formatCampaignList } from '@components/DomainsPage/helpers';
import { FormikHelpers } from 'formik';
import { Footer } from '../Footer/Footer';

type Props = {
  onCancel: () => void;
  onSubmit: (values: DomainCreation, { setSubmitting, setErrors }: FormikHelpers<DomainCreation>) => void;
};
export const EditWindowBody: FC<Props> = ({ onCancel, onSubmit }) => {
  const campaignOptions = useSelector((state: AppState) => state.global.resources.campaignOptions);
  const campaigns = formatCampaignList(campaignOptions);
  const domain = useSelector((state: AppState) => state.domains.editing?.domain);

  if (!domain) {
    return null;
  }
  const { catchNotFound, defaultCampaignId } = domain;

  const initialValues: DomainCreation = {
    ...domain,
    catchNotFound: catchNotFound || false,
    campaigns,
    defaultCampaignId: defaultCampaignId.toString(),
  };

  return (
    <KForm2 initialValues={initialValues} onSubmit={onSubmit} validationSchema={DomainSchema}>
      <KModal.Body>
        <EditForm />
      </KModal.Body>

      <KModal.Footer>
        <Footer onCancel={onCancel} />
      </KModal.Footer>
    </KForm2>
  );
};
