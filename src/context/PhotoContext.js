import React, { createContext, useState } from "react";
import axios from "axios";
//import { apiKey } from "../api/config";
export const PhotoContext = createContext();

const PhotoContextProvider = props => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const runSearch = query => {
    axios
      .get(
        //TODO: Call backend with this url https://api.memeservices.com/${query}
        `https://api.memeservices.com/${query}`
      )
      .then(response => {
        // Api should return the data that gallery then pulls in to display the memes
        // Probably just a list of image URLs ? 
        setImages(response.data);
        //console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(
          "Encountered an error with fetching and parsing data",
          error
        );
      });
  };
  return (
    // Here is where gallery is generated?
    <PhotoContext.Provider value={{ images, loading, runSearch }}>
      {props.children}
    </PhotoContext.Provider>
  );
};

export default PhotoContextProvider;
