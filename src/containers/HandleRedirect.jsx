import axios from "axios";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Box } from "@chakra-ui/react";

function HandleRedirect() {
    const [destination, setDestination] = useState(null);
    const [error, setError] = useState();

    const { shortId } = useParams();

    useEffect(() => {
        async function getData() {
            return axios
                .get(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/url/${shortId}`)
                .then((res) => setDestination(res.data.destination))
                .catch((error) => {
                    // console.log(error)
                    setError(error.response.data.message);
                });
        }
        getData();
    }, [shortId]);

    useEffect(() => {
        if (destination) {
          window.location.replace(destination);
        }
    }, [destination]);

    if (!destination && !error) {
        return (
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Box>
        );
      }
    
      return <p>{error && JSON.stringify(error)}</p>;
}

export default HandleRedirect