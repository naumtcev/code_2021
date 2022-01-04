import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Form as FormBS } from 'react-bootstrap';
import { AppState } from '@core/redux/store';
import { KForm } from '@ui/KForm/KForm';
import { KForm2 } from '@ui/KForm2/KForm2';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';
import { LicenseServiceContext } from '@components/layout/license/LicenseService/LicenseServiceContext';
import { useFormikContext } from 'formik';
import { Option } from '@ui/KSelect/models/Option';

export const EditForm: FC = () => {
  const { t } = useTranslation();
  const installationWithRobotsRedirect = useSelector((state: AppState) => state.domains.installationWithRobotsRedirect);
  const { values } = useFormikContext<DomainCreation>();

  const { isBasicEdition } = useContext(LicenseServiceContext);
  const descrDomainName = !isBasicEdition() ? t('domains.desc') : t('domains.desc_basic');

  const { wildcard, defaultCampaignId, campaigns, allowIndexing } = values;
  const descrDomainWildcart = wildcard && `${t('domains.wildcard_ssl_warning')} ${t('domains.wildcard_deprecate')}`;

  const options = [
    { value: '1', label: t('forms.allow') },
    { value: '0', label: t('forms.disallow') },
  ];

  return (
    <>
      <KForm2.Group controlId="name">
        <KForm2.Label>{t('domains.name')}</KForm2.Label>
        <KForm2.Field>
          <KForm.FieldInput placeholder="domain.com" type="text" name="name" />
          <span className="text-muted help-block">{descrDomainName}</span>
        </KForm2.Field>
      </KForm2.Group>

      <KForm2.Group controlId="sslRedirect">
        <KForm2.Label>{t('domains.ssl_redirect')}</KForm2.Label>
        <KForm2.Field>
          <KForm2.ToggleSwitch isChecked={values.sslRedirect} name="sslRedirect" id="sslRedirect" />
        </KForm2.Field>
      </KForm2.Group>

      <KForm2.Group controlId="wildcard">
        <KForm2.Label>{t('domains.wildcard')}</KForm2.Label>
        <KForm2.Field>
          <KForm2.ToggleSwitch isChecked={values.wildcard} name="wildcard" id="wildcard" />
          <FormBS.Text className="deprecated-description">
            <p className="help-block">{descrDomainWildcart}</p>
          </FormBS.Text>
        </KForm2.Field>
      </KForm2.Group>

      {installationWithRobotsRedirect && (
        <KForm2.Group controlId="allowIndexing">
          <KForm2.Label>{t('domains.indexing')}</KForm2.Label>
          <KForm2.Field>
            <KForm2.CheckList
              type="radio"
              name="allowIndexing"
              options={options}
              inline
              value={allowIndexing ? '1' : '0'}
            />
          </KForm2.Field>
        </KForm2.Group>
      )}

      <KForm2.Group controlId="defaultCampaignId">
        <KForm2.Label>{t('domains.default_campaign')}</KForm2.Label>
        <KForm2.Field>
          <KForm2.Select
            placeholder={t('domains.default_campaign')}
            options={campaigns as Option[]}
            name="defaultCampaignId"
            id="defaultCampaignId"
            isClearable
          />
        </KForm2.Field>
      </KForm2.Group>

      {!!defaultCampaignId && defaultCampaignId !== '0' && (
        <KForm2.Group controlId="catchNotFound">
          <KForm2.Label>{t('domains.catch_not_found')}</KForm2.Label>
          <KForm2.Field>
            <KForm2.ToggleSwitch isChecked={values.catchNotFound} name="catchNotFound" id="catchNotFound" />
          </KForm2.Field>
        </KForm2.Group>
      )}
    </>
  );
};
