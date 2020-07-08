import React from "react";
import Form from "./Form";
import Navigation from "./Navigation";

const Header = ({ history, handleSubmit }) => {
  return (
    <div>
      <h1>Memeservices</h1>
      <h2>The Home of Gourmet Memes</h2>
      <Form history={history} handleSubmit={handleSubmit} />
      <Navigation />
    </div>
  );
};

export default Header;
