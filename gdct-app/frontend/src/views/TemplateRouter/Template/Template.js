import React, { useState, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  showAppNavigation,
  hideAppNavigation,
} from '../../../store/actions/ui/isAppNavigationOpen';
import Loading from '../../../components/Loading/Loading';

import { updateTemplateExcelRequest, getTemplateRequest } from '../../../store/thunks/template';
import { Excel } from '../../../components/Excel';

import './Template.scss';

const Template = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();

  const isCallInProgress = useSelector(
    ({ TemplatesStore: { isCallInProgress } }) => isCallInProgress,
  );

  const handleSaveTemplate = useCallback(() => {
    dispatch(updateTemplateExcelRequest());
  }, []);

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getTemplateRequest(_id));
    dispatch(hideAppNavigation());

    return () => {
      dispatch(showAppNavigation());
    };
  }, []);

  return isCallInProgress ? (
    <Loading />
  ) : (
    <Excel
      type="template"
      returnLink="/template_manager/templates"
      handleSave={handleSaveTemplate}
    />
  );
};

export default Template;
