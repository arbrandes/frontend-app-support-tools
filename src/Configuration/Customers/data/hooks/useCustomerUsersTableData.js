import {
  useCallback, useMemo, useState,
} from 'react';
import _ from 'lodash';
import { camelCaseObject } from '@edx/frontend-platform/utils';
import { logError } from '@edx/frontend-platform/logging';
import debounce from 'lodash.debounce';

import LmsApiService from '../../../../data/services/EnterpriseApiService';

const useEnterpriseUsersTableData = (enterpriseUuid) => {
  const [isLoading, setIsLoading] = useState(true);
  const [enterpriseUsersTableData, setEnterpriseUsersTableData] = useState({
    itemCount: 0,
    pageCount: 0,
    results: [],
  });
  const fetchEnterpriseUsersData = useCallback((args) => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const options = {};

        args.sortBy.filter((sort) => {
          const { id, desc } = sort;
          if (id === 'administrator') {
            options.ordering = desc ? id : `-${id}`;
          }
          if (id === 'userDetails') {
            options.ordering = desc ? id : `-${id}`;
          }
          if (id === 'learner') {
            options.ordering = desc ? id : `-${id}`;
          } 
        });

        args.filters.forEach((filter) => {
          const { id, value } = filter;
          if (id === 'username') {
            options.user_query = value;
          }
        });
      

        options.page = args.pageIndex + 1;
        const response = await LmsApiService.fetchEnterpriseCustomerUsers(enterpriseUuid, options);
        const { data } = camelCaseObject(response);
        console.log(args)
        setEnterpriseUsersTableData({
          itemCount: data.count,
          pageCount: data.numPages,
          results:data.results,
        });
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (enterpriseUuid) {
      fetch();
    }
  }, [enterpriseUuid]);

  const debouncedFetchEnterpriseUsersData = useMemo(
    () => debounce(fetchEnterpriseUsersData, 300),
    [fetchEnterpriseUsersData],
  );

  return {
    isLoading,
    enterpriseUsersTableData,
    fetchEnterpriseUsersData: debouncedFetchEnterpriseUsersData,
  };
};

export default useEnterpriseUsersTableData;
