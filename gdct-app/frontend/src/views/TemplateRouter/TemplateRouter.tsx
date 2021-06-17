import React from 'react';

import { Switch, Route } from 'react-router-dom';

//@ts-ignore
import NotFound from '../../components/NotFound';

// remove when these are tsx
//@ts-ignore
import Template from './Template';
//@ts-ignore
import Templates from './Templates';
import TemplateTypes from './TemplateTypes';
import TemplateType from './TemplateType';
import TemplatePackages from './TemplatePackages';
import TemplatePackage from './TemplatePackage';
//@ts-ignore
import { ROUTE_TEMPLATE_PCKGS_PCKG, ROUTE_TEMPLATE_PCKGS_PCKGS } from '../../constants/routes';

const TemplateRouter = () => (
  <Switch>
    <Route exact path="/admin/template/design" component={Templates} />
    <Route exact path="/admin/template/design/:_id" component={Template} />
    <Route exact path="/admin/template/type" component={TemplateTypes} />
    <Route exact path="/admin/template/type/:_id" component={TemplateType} />
    <Route exact path={ROUTE_TEMPLATE_PCKGS_PCKGS} component={TemplatePackages} />
    <Route exact path={ROUTE_TEMPLATE_PCKGS_PCKG} component={TemplatePackage} />
    <Route component={NotFound} />
  </Switch>
);

export default TemplateRouter;
