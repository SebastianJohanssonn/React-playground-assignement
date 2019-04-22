import React, { Suspense, CSSProperties } from 'react';
import { Route, Switch } from 'react-router-dom';
import Spinner from '../spinner';
import SearchBar from "./searchBar";

const MasterView = React.lazy(() => import(/* webpackChunkName: "masterView" */ './masterView'));
const DetailView = React.lazy(() => import(/* webpackChunkName: "detailView" */ './detailView/detailView'));

/** React function component */
export default function ViewContainer() {

    const view = "";

    return (
        <Suspense fallback={<Spinner/>}>
            <Switch>
                <Route exact path="/:id" component={DetailView}/>
                <div style={centered}>
                    <SearchBar />
                </div>
            </Switch>
        </Suspense>
    );
}
const centered: CSSProperties = {
    height: '100%',
    textAlign: 'center',
    marginTop: '5em'
}