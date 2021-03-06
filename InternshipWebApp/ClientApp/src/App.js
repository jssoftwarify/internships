import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router";
import { ApplicationProvider } from "./providers/ApplicationProvider.js";
import TopErrorBoundary from "./components/errors/TopErrorBoundary.js";

import Accounts from "./components/Entities/Accounts";

import Classrooms from "./components/Entities/Classrooms/index.js";
import ClassroomCreate from "./components/Entities/Classrooms/ClassroomCreate.js";
import ClassroomDetail from "./components/Entities/Classrooms/ClassroomDetail.js";

import Companies from "./components/Entities/Companies/index.js";
import CompanyCreate from "./components/Entities/Companies/CompanyCreate.js";
import CompanyDetail from "./components/Entities/Companies/CompanyDetail.js";
import AddressCreate from "./components/Entities/Companies/AddressCreate.js";
import AddressDetail from "./components/Entities/Companies/AddressDetail.js";
import Definitions from "./components/Entities/Definitions/index.js";
import DefinitionCreate from "./components/Entities/Definitions/DefinitionCreate.js";
import DefinitionDetail from "./components/Entities/Definitions/DefinitionDetail.js";
import Improvements from "./components/Entities/Improvements/index.js";
import ImprovementCreate from "./components/Entities/Improvements/ImprovementCreate.js";
import ImprovementDetail from "./components/Entities/Improvements/ImprovementDetail.js";
import Internships from "./components/Entities/Internships/index.js";
import InternshipCreate from "./components/Entities/Internships/InternshipCreate.js";
import InternshipDetail from "./components/Entities/Internships/InternshipDetail.js";
import Specializations from "./components/Entities/Specializations/index.js";
import SpecializationCreate from "./components/Entities/Specializations/SpecializationCreate.js";
import SpecializationDetail from "./components/Entities/Specializations/SpecializationDetail.js";
import Records from "./components/Entities/Records/Index.js";
import RecordCreate from "./components/Entities/Records/RecordCreate";
import RecordDetail from "./components/Entities/Records/RecordDetail";
import InspectionCreate from "./components/Entities/Inspections/InspectionCreate";
import InspectionDetail from "./components/Entities/Inspections/InspectionDetail";
import Map from "./components/Pages/Map";
import Home from "./components/Pages/Home.js";
import Users from "./components/Entities/Users/index.js";
import NotFound from "./components/messages/NotFound.js";

import SignInCallback from "./components/Auth/SignInCallback.js";
import SilentRenew from "./components/Auth/SilentRenew.js";
import SignOutCallback from "./components/Auth/SignOutCallback.js";

function App() {
  return (
    <TopErrorBoundary>
      <ApplicationProvider>
        <>
          <Router>
            <Switch>
              <Route path="/oidc-callback" component={SignInCallback} />
              <Route
                path="/oidc-signout-callback"
                component={SignOutCallback}
              />
              <Route path="/oidc-silent-renew" component={SilentRenew} />
              <Route path="/accounts/" component={Accounts} />
              <Route exact path="/classrooms/" component={Classrooms} />
              <Route path="/classrooms/create/" component={ClassroomCreate} />
              <Route path="/classrooms/:id" exact component={ClassroomDetail} />
              <Route exact path="/companies/" component={Companies} />
              <Route
                path="/companies/create/"
                exact
                component={CompanyCreate}
              />
              <Route path="/companies/:id" exact component={CompanyDetail} />

              <Route
                path="/companies/create/address/"
                component={AddressCreate}
                exact
              />
              <Route
                path="/companies/addresses/:id"
                component={AddressDetail}
                exact
              />
              <Route exact path="/definitions/" component={Definitions} />
              <Route
                exact
                path="/definitions/create/"
                component={DefinitionCreate}
              />
              <Route
                exact
                path="/definitions/:id"
                component={DefinitionDetail}
              />
              <Route exact path="/improvements/" component={Improvements} />
              <Route
                exact
                path="/improvements/create"
                component={ImprovementCreate}
              />
              <Route
                path="/improvements/:id"
                exact
                component={ImprovementDetail}
              />
              <Route exact path="/internships/" component={Internships} />
              <Route
                exact
                path="/internships/create"
                component={InternshipCreate}
              />
              <Route
                exact
                path="/internships/:id"
                component={InternshipDetail}
              />
              <Route exact path="/users/" component={Users} />
              <Route
                exact
                path="/specializations/"
                component={Specializations}
              />
              <Route
                path="/specializations/create/"
                component={SpecializationCreate}
                exact
              />
              <Route
                path="/specializations/:id"
                component={SpecializationDetail}
                exact
              />
              <Route
                path="/inspections/create/:id"
                component={InspectionCreate}
                exact
              />

              <Route
                path="/inspections/:id"
                component={InspectionDetail}
                exact
              />
              <Route path="/map" component={Map} exact />
              <Route exact path="/records/" component={Records} />
              <Route path="/records/create/" component={RecordCreate} exact />
              <Route path="/records/:id" component={RecordDetail} exact />
              <Route path="/home" component={Home} exact />
              <Route exact path="/" component={Accounts} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </>
      </ApplicationProvider>
    </TopErrorBoundary>
  );
}
export default App;
