// pages/TestPage.jsx
import React from "react";
import SidebarLayout from "../components/SideBarLayout";
import TestList from "../components/TestList";

const TestPage = () => {
  return (
    <SidebarLayout>
      <TestList />
    </SidebarLayout>
  );
};

export default TestPage;
