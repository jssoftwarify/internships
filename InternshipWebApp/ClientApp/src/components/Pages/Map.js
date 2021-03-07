import React, { useState, useEffect } from "react";
import { useAppContext } from "../../providers/ApplicationProvider";

import axios from "axios";

import Navbar from "../layouts/layout-components/Navbar";
import MessageLayout from "../layouts/MessageLayout.js";
import Login from "./Login";
import Loading from "./Loading";
import Error from "../messages/Error.js";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import {
  Button,
  Col,
  Row,
  Container,
  Form,
  FormGroup,
  Input,
} from "reactstrap";

import "../styles/map-style.css";

const Map = () => {
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [center] = useState([50.76628, 15.054339]);
  const [companies, setCompanies] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState({});
  const [definitionIds, setDefinitionIds] = useState([]);
  const [definitions, setDefinitions] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`)
      .then((response) => {
        response.data.data.forEach((item) => {
          if (item.email === profile.email) {
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/Users/${item.id}`)
              .then((response) => {
                setUser(response.data);
              })
              .catch((error) => {
                setError(true);
              });
          }
        });
      })
      .catch((error) => {});
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Company`)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        setError(true);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/CompanyAddress`)
      .then((response) => {
        setAddresses(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/internship`)
      .then((response) => {
        setInternships(response.data);
      })
      .catch((error) => {});
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/ProfessionalExperienceDefinition`
      )
      .then((response) => {
        setDefinitions(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);
  const renderMarkers = (definitions) => {
    const markers = addresses.map((item) => {
      var company;
      var numberOfUsers = 0;
      companies.forEach((item2) => {
        if (item2.id === item.companyId) {
          company = item2.name;
        }
      });
      internships.forEach((item3) => {
        if (
          (item3.companyAddress.id === item.id) &
          item3.aktivni &
          item3.professionalExperienceDefinition.active
        ) {
          if (definitions) {
            definitions.map((item4) => {
              if (item3.professionalExperienceDefinition.id === item4) {
                numberOfUsers++;
              }
            });
          } else {
            numberOfUsers++;
          }
        }
      });
      if (numberOfUsers > 0) {
        if (
          profile.hasOwnProperty("internship_student") |
          profile.hasOwnProperty("internship_administrator")
        ) {
          return (
            <Marker position={[item.latitude, item.longtitude]} key={item.id}>
              <Popup>
                <b>{company}</b>
                <br />
                {`${item.streetName} ${item.houseNumber}, ${item.city}, ${item.postalCode}`}
                <br />
                Počet uživatelů: <b>{numberOfUsers}</b>
              </Popup>
            </Marker>
          );
        } else if (profile.hasOwnProperty("internship_controller")) {
          if (item.freeForInspection) {
            return (
              <Marker position={[item.latitude, item.longtitude]} key={item.id}>
                <Popup>
                  <b>{company}</b>
                  <br />
                  {`${item.streetName} ${item.houseNumber}, ${item.city}, ${item.postalCode}`}
                  <br />
                  Počet studentů: <b>{numberOfUsers}</b>
                </Popup>
              </Marker>
            );
          }
        }
      }
    });
    return markers;
  };

  const renderMarkersByDefinition = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/internship/byDefinition`,
        {
          Ids: definitionIds,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setInternships(response.data);
      })
      .catch((error) => {})
      .then(() => {
        setLoading(false);
      });
  };

  const handleChange = (event) => {
    let opts = [],
      opt;

    for (let i = 0, len = event.target.options.length; i < len; i++) {
      opt = event.target.options[i];

      if (opt.selected) {
        opts.push(parseInt(opt.value));
      }
    }
    setDefinitionIds(opts);
  };

  const renderDefinitions = () => {
    const array = definitions.map((item) => {
      return (
        <option
          key={item.id}
          value={item.id}
        >{`${item.name} (${item.year})`}</option>
      );
    });
    return array;
  };
  if (accessToken) {
    if (error) {
      return (
        <Navbar profile={profile} active_item="Map">
          <Error />
        </Navbar>
      );
    } else if (loading) {
      return (
        <Navbar profile={profile} active_item="Map">
          <Loading />
        </Navbar>
      );
    } else if (
      (addresses !== []) &
      (companies !== []) &
      (internships !== []) &
      (user !== {})
    ) {
      return (
        <Navbar profile={profile} active_item="Map">
          <Container className="container-select">
            <Row>
              <Col
                lg="6"
                md="6"
                sm="8"
                xs="8"
                className="text-right select-multiple"
              >
                <Form>
                  <FormGroup>
                    <Input
                      type="select"
                      name="selectMulti"
                      id="exampleSelectMulti"
                      onChange={(e) => handleChange(e)}
                      value={definitionIds}
                      multiple
                    >
                      {renderDefinitions()}
                    </Input>
                  </FormGroup>
                </Form>
              </Col>
              <Col lg="6" md="6" sm="4" xs="4">
                <Row>
                  <Col lg="12" md="12" sm="12" xs="12">
                    <Button
                      color="primary"
                      onClick={() => renderMarkersByDefinition()}
                      className="button-search"
                    >
                      Hledat
                    </Button>
                  </Col>
                  
                </Row>
              </Col>
            </Row>
            <Row>
              <MapContainer
                style={{
                  height: "80vh",
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                zoom={12}
                scrollWheelZoom={true}
                center={center}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {renderMarkers()}
              </MapContainer>
            </Row>
          </Container>
        </Navbar>
      );
    } else {
      return (
        <Navbar profile={profile} active_item="Map">
          <Loading />
        </Navbar>
      );
    }
  } else {
    return (
      <MessageLayout>
        <Login />
      </MessageLayout>
    );
  }
};
export default Map;
