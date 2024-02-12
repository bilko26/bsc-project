import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./nav.module.css";
import { Tabs } from "devextreme-react";

const Navbar = () => {
  const links = [
    {
      id: "/",
      text: "Rent Dashboard",
      idx: 0,
      icon: "chart",
    },
    {
      id: "/urban",
      text: "Urban Info",
      idx: 1,
      icon: "info",
    },
    {
      id: "/heat",
      text: "Heat Map",
      idx: 2,
      icon: "map",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname;
  const [selectedTab, setSelectedTab] = React.useState(
    links.findIndex((e) => e.id == slug)
  );

  return (
    <div>
      <Tabs
        className={styles.navBar}
        onItemClick={(e) => {
          setSelectedTab(e.itemData?.idx ?? 0);
          navigate(e.itemData?.id ?? "/");
        }}
        selectedItem={links.find((x) => x.idx == selectedTab)}
        dataSource={links}
        showNavButtons={true}
        orientation="horizontal"
        stylingMode="primary"
        iconPosition="start"
      />
    </div>
  );
};

export default Navbar;
