import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Error from "../../messages/Error.js";

import SearchCreate from "../../SearchCreate.js";
import DeleteEdit from "../../DeleteEdit.js";

import Table from "react-bootstrap/Table";

import { Row, Col, Container, InputGroup, Input, Button } from "reactstrap";
import Switch from "@material-ui/core/Switch";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../styles/navbar-style.css";

const Companies = (props) => {
  const [{ accessToken, profile }] = useAppContext();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [siteMode, setSiteMode] = useState({
    companies: true,
    addresses: false,
  });
  const [search, setSearch] = useState("");
  const [descCompany, setDescCompany] = useState(false);
  const [descAddress, setDescAddress] = useState(false);

  function changeSiteMode() {
    if (siteMode.addresses === true) {
      setSiteMode({ companies: true, addresses: false });
    } else {
      setSiteMode({ companies: false, addresses: true });
    }
  }
  useEffect(() => {
    setLoading(true);
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
        console.log(error);
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);
  const searchRequest = (searchString, sortString, mode) => {
    setLoading(true);
    if (mode === "company") {
      axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }/api/Company?search=${searchString}&sort=${sortString}${
            descCompany ? `_desc` : `_asc`
          }`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setCompanies(response.data);
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    } else if (mode === "address") {
      axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }/api/CompanyAddress?search=${searchString}&sort=${sortString}${
            descAddress ? `_desc` : `_asc`
          }`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setAddresses(response.data);
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    }
  };

  function renderCompanyAddressList() {
    const array = addresses.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.streetName}</td>
          <td>{item.houseNumber}</td>
          <td>{item.city}</td>
          <td>{item.postalCode}</td>
          <td className="text-center">
            <FontAwesomeIcon
              icon={item.headquarter ? faCheck : null}
              size="2x"
              color="#ffffff"
              style={{ padding: 5 }}
            ></FontAwesomeIcon>
          </td>
          <td>{item.company !== null ? item.company.name : " "}</td>
          <td style={{ textAlign: "center" }}>
            <DeleteEdit
              toShow={`companies/addresses/${item.id}`}
              toDelete={`CompanyAddress/${item.id}`}
              editedItem={item}
              title="Mazání adresy"
              body={`Vážně chcete smazat adresu: ${item.streetName} ${item.houseNumber}, ${item.city}, ${item.postalCode}`}
            ></DeleteEdit>
          </td>
        </tr>
      );
    });
    return array;
  }
  function renderCompanyList() {
    const array = companies.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td style={{ textAlign: "center" }}>
            <DeleteEdit
              toShow={`companies/${item.companyIdentificationNumber}`}
              toDelete={`Company/${item.id}`}
              editedItem={item}
              title="Mazání firmy"
              body={`Vážně chcete smazat firmu: ${item.name}`}
            ></DeleteEdit>
          </td>
        </tr>
      );
    });
    return array;
  }
  if (accessToken) {
    if (error) {
      return (
        <Navbar profile={profile} active_item="Companies">
          <Error />
        </Navbar>
      );
    } else if (loading) {
      return (
        <Navbar profile={profile} active_item="Companies">
          <Loading />
        </Navbar>
      );
    } else if (companies && addresses) {
      if (siteMode.companies) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Container style={{ color: "white" }}>
              <Row className="justify-content-center">Firmy / Adresy</Row>
              <Row className="justify-content-center">
                <Switch
                  onChange={changeSiteMode}
                  name="siteMode"
                  color="default"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </Row>
              <Row>
                <Col className="col-lg-11 col-md-12 col-sm-12">
                  <Row>
                    <Col>
                      <InputGroup className="search-input">
                        <Input
                          placeholder="vyhledat firmu..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col style={{ padding: 0 }}>
                      <Button
                        color="primary"
                        onClick={(e) => searchRequest(search, "", "company")}
                        style={{ marginRight: 2 }}
                      >
                        Hledat
                      </Button>
                      <Button
                        color="success"
                        onClick={() => history.push("companies/create")}
                        style={{ marginLeft: 2 }}
                      >
                        Přidat
                      </Button>
                    </Col>
                  </Row>
                  <Table responsive hover striped variant="dark">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "name", "company");
                              setDescCompany(!descCompany);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Název
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderCompanyList()}</tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </Navbar>
        );
      } else if (siteMode.addresses) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Container style={{ color: "white" }}>
              <Row className="justify-content-center">Firmy / Adresy</Row>
              <Row className="justify-content-center">
                <Switch
                  onChange={changeSiteMode}
                  name="siteMode"
                  color="default"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </Row>
              <Row>
                <Col className="col-lg-11 col-md-12 col-sm-12">
                  <Row>
                    <Col>
                      <InputGroup className="search-input">
                        <Input
                          placeholder="vyhledat adresu..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col style={{ padding: 0 }}>
                      <Button
                        color="primary"
                        onClick={(e) => searchRequest(search, "", "address")}
                        style={{ marginRight: 2 }}
                      >
                        Hledat
                      </Button>
                      <Button
                        color="success"
                        onClick={() =>
                          history.push("companies/create/address/")
                        }
                        style={{ marginLeft: 2 }}
                      >
                        Přidat
                      </Button>
                    </Col>
                  </Row>
                  <Table responsive hover striped variant="dark">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "streetNumber", "address");
                              setDescAddress(!descAddress);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Ulice
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "houseNumber", "address");
                              setDescAddress(!descAddress);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Číslo popisné
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "city", "address");
                              setDescAddress(!descAddress);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Město
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "pc", "address");
                              setDescAddress(!descAddress);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            PSČ
                          </button>
                        </th>
                        <th>Hlavní sídlo</th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "company", "address");
                              setDescAddress(!descAddress);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Firma
                          </button>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>{renderCompanyAddressList()}</tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Companies">
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
export default Companies;
