import { mount } from 'enzyme';
import React from 'react';

import * as api from '../data/api';
import TogglePasswordStatus from './TogglePasswordStatus';
import UserSummaryData from '../data/test/userSummary';

describe('Toggle Password Status Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    const data = {
      username: UserSummaryData.userData.username,
      passwordStatus: UserSummaryData.userData.passwordStatus,
      changeHandler: UserSummaryData.changeHandler,
    };
    wrapper = mount(<TogglePasswordStatus {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Disable User Button', () => {
    it('Disable User button for active user', () => {
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Disable User Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementation(() => {});
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      let disableDialogModal = wrapper.find('Modal#user-account-status-toggle');

      expect(disableDialogModal.prop('open')).toEqual(false);
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      passwordActionButton.simulate('click');
      disableDialogModal = wrapper.find('Modal#user-account-status-toggle');

      expect(disableDialogModal.prop('open')).toEqual(true);
      expect(disableDialogModal.prop('title')).toEqual('Disable user confirmation');
      disableDialogModal.find('input[name="comment"]').simulate('change', { target: { value: 'Disable Test User' } });
      disableDialogModal.find('button.btn-danger').hostNodes().simulate('click');

      expect(UserSummaryData.changeHandler).toHaveBeenCalled();
      disableDialogModal.find('button.btn-link').simulate('click');
      disableDialogModal = wrapper.find('Modal#user-account-status-toggle');
      expect(disableDialogModal.prop('open')).toEqual(false);
      mockApiCall.mockRestore();
    });
  });

  describe('Enable User Button', () => {
    beforeEach(() => {
      const passwordStatusData = { ...UserSummaryData.userData.passwordStatus, status: 'Unusable' };
      const data = {
        username: UserSummaryData.userData.username,
        passwordStatus: passwordStatusData,
        changeHandler: UserSummaryData.changeHandler,
      };
      wrapper = mount(<TogglePasswordStatus {...data} />);
    });

    it('Enable User button for disabled user', () => {
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Enable User Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementation(() => {});
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      let enableUserModal = wrapper.find('Modal#user-account-status-toggle');

      expect(enableUserModal.prop('open')).toEqual(false);
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      passwordActionButton.simulate('click');
      enableUserModal = wrapper.find('Modal#user-account-status-toggle');

      expect(enableUserModal.prop('open')).toEqual(true);
      expect(enableUserModal.prop('title')).toEqual('Enable user confirmation');
      enableUserModal.find('input[name="comment"]').simulate('change', { target: { value: 'Enable Test User' } });
      enableUserModal.find('button.btn-danger').hostNodes().simulate('click');

      expect(UserSummaryData.changeHandler).toHaveBeenCalled();
      mockApiCall.mockRestore();
    });
  });
});