import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { KModal } from '@ui/KModal/KModal';
import { KButton } from '@ui/KButton/KButton';
import { WindowServiceContext } from '@components/DomainsPage/WindowService/WindowServiceContext';
import { useSelector } from 'react-redux';
import { AppState } from '@core/redux/store';

type Props = {
  id: string;
  onClose: () => void;
};
export const NotesWindow: FC<Props> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const { saveNoteDomain } = useContext(WindowServiceContext);
  const domains = useSelector((state: AppState) => state.domains.domains);
  const domainId = parseInt(id, 10);
  const getNotes = (id: string) => domains.find((d) => d.id === id)?.notes || '';

  return (
    <>
      <KModal size="lg" onHide={onClose}>
        <KModal.Body>
          <Form>
            <Form.Control
              as="textarea"
              rows={10}
              onChange={(e) => saveNoteDomain(domainId, e.currentTarget.value)}
              defaultValue={getNotes(id)}
            />
          </Form>
        </KModal.Body>

        <KModal.Footer>
          <KButton variant="secondary" onClick={onClose}>
            {t('forms.close')}
          </KButton>
        </KModal.Footer>
      </KModal>
    </>
  );
};
