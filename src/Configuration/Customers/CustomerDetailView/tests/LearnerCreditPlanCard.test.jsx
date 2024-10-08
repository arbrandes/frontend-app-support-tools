/* eslint-disable react/prop-types */
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { formatDate } from '../../data/utils';
import LearnerCreditPlanCard from '../LearnerCreditPlanCard';

jest.mock('../../data/utils', () => ({
  formatDate: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockData = {
  isActive: true,
  subsidy: {
    activeDatetime: '2024-08-23T20:02:57.651943Z',
    created: '2024-08-23T20:02:57.651943Z',
    expirationDatetime: '2024-08-23T20:02:57.651943Z',
    uuid: 'test-uuid',
  },
  slug: 'test-customer-slug',
};

describe('LearnerCreditPlanCard', () => {
  it('renders active LearnerCreditPlanCard data', () => {
    formatDate.mockReturnValue('Aug 23, 2024');
    getConfig.mockImplementation(() => ({
      ADMIN_PORTAL_BASE_URL: 'http://www.testportal.com',
      SUBSIDY_BASE_DJANGO_URL: 'http://www.enterprise-subsidy.com',
    }));
    render(
      <IntlProvider locale="en">
        <LearnerCreditPlanCard {...mockData} />
      </IntlProvider>,
    );
    expect(screen.getByText('LEARNER CREDIT PLAN')).toBeInTheDocument();
    expect(screen.getByText('Aug 23, 2024 - Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByText('Created Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View budgets' })).toHaveAttribute('href', 'http://www.testportal.com/test-customer-slug/admin/learner-credit/');
    expect(screen.getByRole('link', { name: 'Open in Django' })).toHaveAttribute('href', 'http://www.enterprise-subsidy.com/admin/subsidy/subsidy/test-uuid/change/');
  });

  it('renders inactive LearnerCreditPlanCard data', () => {
    const inactiveData = {
      ...mockData,
      isActive: false,
    };
    formatDate.mockReturnValue('Aug 23, 2024');
    getConfig.mockImplementation(() => ({
      ADMIN_PORTAL_BASE_URL: 'http://www.testportal.com',
      SUBSIDY_BASE_DJANGO_URL: 'http://www.enterprise-subsidy.com',
    }));
    render(
      <IntlProvider locale="en">
        <LearnerCreditPlanCard {...inactiveData} />
      </IntlProvider>,
    );
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('LEARNER CREDIT PLAN')).toBeInTheDocument();
    expect(screen.getByText('Aug 23, 2024 - Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByText('Created Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View budgets' })).toHaveAttribute('href', 'http://www.testportal.com/test-customer-slug/admin/learner-credit/');
    expect(screen.getByRole('link', { name: 'Open in Django' })).toHaveAttribute('href', 'http://www.enterprise-subsidy.com/admin/subsidy/subsidy/test-uuid/change/');
  });
});
