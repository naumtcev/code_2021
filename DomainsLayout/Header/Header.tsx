import React, { FC, memo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const Header: FC = memo(() => {
  const { t } = useTranslation();
  return (
    <Row>
      <Col>
        <h1 className="page-header">
          <span>{t('domains.title')}</span>
        </h1>
      </Col>
    </Row>
  );
});
