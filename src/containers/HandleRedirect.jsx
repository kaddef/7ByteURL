import axios from "axios";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Box } from "@chakra-ui/react";

const SERVER_ENDPOINT = 'http://localhost:4000'

function HandleRedirect() {
    const [destination, setDestination] = useState(null);
    const [error, setError] = useState();

    const { shortId } = useParams();

    console.log(shortId);
    
    useEffect(() => {
        async function getData() {
            return axios
                .get(`${SERVER_ENDPOINT}/api/url/${shortId}`)
                .then((res) => setDestination(res.data.destination))
                .catch((error) => {
                    console.log(error)
                    setError(error.message);
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