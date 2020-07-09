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
        //TODO: We will need to create an API or something to pull different types of memes from the GCloud bucket.
        //TODO: Call backend with this url https://memeservices-4c685.uc.r.appspot.com/${query}
        `https://memeservices-4c685.uc.r.appspot.com/${query}`
      )
      .then(response => {
        setImages(response.data.photos.photo);
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
    <PhotoContext.Provider value={{ images, loading, runSearch }}>
      {props.children}
    </PhotoContext.Provider>
  );
};

export default PhotoContextProvider;
