import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Spinner from '../spinner';

const MasterView = React.lazy(() => import(/* webpackChunkName: "masterView" */ './masterView'));
const DetailView = React.lazy(() => import(/* webpackChunkName: "detailView" */ './detailView/detailView'));

/** React function component */
export default function ViewContainer() {

    const detailViews = ['forest', 'sky', 'desert'];

    return (
        <Suspense fallback={<Spinner/>}>
            <Switch>
                <Route exact path="/" render={() =>
                    <MasterView detailViews={detailViews}/>
                }/>
                    <Route path="/forest" component={DetailView}/>
                    <Route path="/sky" component={DetailView}/>
                    <Route path="/desert" component={DetailView}/>
            </Switch>
        </Suspense>
    );
}