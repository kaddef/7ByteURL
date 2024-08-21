import { useState, useEffect } from "react";
import { Image } from "@chakra-ui/react";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return windowDimensions;
}
  

function Background() {
    const { width, height } = useWindowDimensions();
    const image = `https://picsum.photos/${width}/${height}`

    return (
        <Image
            position="fixed"
            top="0"
            left="0"
            bottom="0"
            right="0"
            zIndex="1"
            src={image}
            alt="bg"
        />

    );
}

export default Background;