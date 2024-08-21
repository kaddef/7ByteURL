import { Input, Button, Box, Heading, InputGroup, Text, Link, HStack, VStack, Stack, IconButton } from "@chakra-ui/react"
import { ExternalLinkIcon, LinkIcon } from '@chakra-ui/icons'
import axios from "axios";
import { useEffect, useState } from 'react';
import ShortenedURLInfo from "./ShortenedURLInfo";

function URLShortenerFrom () {
    const [destination, setDestination] = useState("");
    const [shortURLData, setShortURLData] = useState({});
    const [isURLShortened, setIsURLShortened] = useState(false);

    async function submitHandler(e) {
        e.preventDefault();
        const result = await axios
        .post(`http://localhost:4000/api/url`, {
            destination
        })
        .then((response) => response.data)
        setShortURLData(result)
        setIsURLShortened(true)
        localStorage.setItem("shortURLData",JSON.stringify(result))
        console.log(result)
    }

    function getReadyForReuse() {
        setDestination("")
        setShortURLData({})
        setIsURLShortened(false);
        localStorage.removeItem('shortURLData');
    }

    useEffect(() => {
        const localData = localStorage.getItem("shortURLData")
        if(localData) {
            console.log("SHORtid var zaten")
            console.log(JSON.parse(localData))
            setShortURLData(JSON.parse(localData))
            setIsURLShortened(true)
        }
    },[])

    return (
        <>
            {!isURLShortened ? (
                <Box
                width="400px"
                pos="relative" 
                zIndex="2" 
                background="#ffffff"
                padding="10"
                borderRadius={12}
                >
                    <form>
                        <VStack alignItems="stretch">
                            <HStack>
                                <LinkIcon color="#007BFF"/>
                                <Text color="#212529">Shorten a long URL</Text>
                            </HStack>
                            <Input
                                onChange={(e) => setDestination(e.target.value)}
                                value={destination}
                                placeholder="https://example.com"
                                borderColor="#007BFF"
                                _placeholder={{ color: "#6c757d" }}
                            />
                            <Button _hover={{ backgroundColor: "#0056b3" }} backgroundColor="#007BFF" color="white" type="submit" onClick={submitHandler}>
                                CREATE
                            </Button>
                        </VStack>
                        {shortURLData.shortId && 
                            <Link href={`/${shortURLData.shortId}`} isExternal>
                                {`${window.location.origin}/${shortURLData.shortId}`} <ExternalLinkIcon mx='2px' />
                            </Link>
                        }
                    </form>
                </Box>
            ):(
                <ShortenedURLInfo shortURLData={shortURLData} onReuse={getReadyForReuse} />            
            )}
        </>
    );
}

export default URLShortenerFrom