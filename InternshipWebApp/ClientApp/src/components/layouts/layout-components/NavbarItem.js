import React, { useState } from "react";
import { Link } from "react-router-dom";
import underline from "../../../assets/underline.png";

import { Badge, Tooltip } from "reactstrap";

const NavbarItem = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <li>
      <p>
        <Link to={props.to} active_item={props.active_item}>
          {props.itemName}{" "}
          {!(props.badgeNumber != null) || props.badgeNumber === 0 ? (
            " "
          ) : (
            <>
              <Badge color="danger" id="Notifications">
                {props.badgeNumber}
              </Badge>
              <Tooltip
                placement="right"
                isOpen={tooltipOpen}
                target="Notifications"
                toggle={toggle}
                html={true}
              >
                {props.badgeText.classroom != null
                  ? props.badgeText.classroom
                  : " "}
                <br />
                {props.badgeText.internship != null
                  ? props.badgeText.internship
                  : " "}
                <br />
                {props.badgeText.specialization != null
                  ? props.badgeText.specialization
                  : " "}
              </Tooltip>
            </>
          )}
        </Link>
      </p>
      <img
        src={underline}
        className="underline"
        style={{ visibility: props.active }}
        alt="underline"
      />
    </li>
  );
};
export default NavbarItem;
