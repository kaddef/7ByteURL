import { useToast, Input, Button, Box, Text, Link, HStack, VStack } from "@chakra-ui/react"
import { ExternalLinkIcon, LinkIcon } from '@chakra-ui/icons'
import axios from "axios";
import { useEffect, useState } from 'react';
import ShortenedURLInfo from "./ShortenedURLInfo";

function URLShortenerFrom () {
    const toast = useToast()
    const [destination, setDestination] = useState("");
    const [shortURLData, setShortURLData] = useState({});
    const [isURLShortened, setIsURLShortened] = useState(false);

    async function submitHandler(e) {
        e.preventDefault();
        try {
            const result = await axios.post(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/url`, {
                destination
            })
            setShortURLData(result.data)
            setIsURLShortened(true)
            localStorage.setItem("shortURLData",JSON.stringify(result.data))
            console.log(result.data)
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: error.response.data.message || "There was an error processing your request",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
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