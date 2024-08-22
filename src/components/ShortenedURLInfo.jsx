import { useToast, Alert, AlertIcon, Box, Tabs, TabList, TabPanels, Tab, TabPanel, Stat, StatLabel, StatNumber, StatHelpText, Input, Button, Text, Stack, HStack, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { saveAs } from 'file-saver';

function ShortenedURLInfo({ shortURLData, onReuse }) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (activeTab === 1 && shortURLData.shortId) {
      async function fetchAnalytics() {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/url/analytics/${shortURLData.shortId}`);
          setAnalyticsData(response.data);
          // console.log(response)
          // console.log(analyticsData)
        } catch (error) {
          console.error('Error fetching analytics data:', error);
        }
      }

      fetchAnalytics();
    }
  }, [activeTab, shortURLData.shortId])

  async function fetchQrCode() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/qr/${shortURLData.shortId}`, {
        responseType: 'arraybuffer'
      });
      const blob = new Blob([response.data], {type: 'image/png'});
      saveAs(blob, shortURLData.shortId)
      // console.log("QR Code fetched successfully:", response);
    } catch (error) {
      const errorText = new TextDecoder().decode(error.response.data);
      const errorJson = JSON.parse(errorText);
      // console.log("Error fetching QR Code:", errorJson.message);
      toast({
        title: "Error",
        description: errorJson.message || "There was an error processing your request",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <Box
    width="400px"
    pos="relative" 
    zIndex="2" 
    background="#f8f9fa"
    padding="10"
    borderRadius={12}
    >
    <Tabs variant='soft-rounded' onChange={(index) => {setActiveTab(index);console.log(activeTab)}}>
      <TabList>
        <Tab>Url Info</Tab>
        <Tab>Analytics</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
            <Stack spacing={4}>
                <VStack align="start">
                    <Text color="#212529">Long URL</Text>
                    <Input readOnly value={shortURLData.destination || ""}></Input>
                </VStack>
                <VStack align="start">
                    <Text color="#212529">Short Url</Text>
                    <Input readOnly value={shortURLData.shortId ? `${window.location.origin}/${shortURLData.shortId}` : ""}></Input>
                </VStack>
                <HStack>
                    <Button w="full" backgroundColor="#007BFF" color="white" _hover={{ backgroundColor: "#0056b3" }} onClick={() => {window.open(`${window.location.origin}/${shortURLData.shortId}`,'_blank')}}>Visit URL</Button>
                    <Button w="full" backgroundColor="#007BFF" color="white" _hover={{ backgroundColor: "#0056b3" }} onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/${shortURLData.shortId}`)}}>Copy</Button>
                    <Button w="full" backgroundColor="#007BFF" color="white" _hover={{ backgroundColor: "#0056b3" }} onClick={fetchQrCode}>QR</Button>
                </HStack>
                <Button backgroundColor="#007BFF" color="white" _hover={{ backgroundColor: "#0056b3" }} w="100%" onClick={onReuse}>Shorten Another One</Button>
                <Alert status='info'>
                  <AlertIcon />
                  <Text fontSize='xs'>Once you shorten another one, you lose the analytics for this URL.</Text>
                </Alert>
            </Stack>
        </TabPanel>
        <TabPanel>
          {analyticsData ? (
            <HStack spacing={5}>
              <Stat>
                <StatLabel>Total Clicks</StatLabel>
                <StatNumber>{analyticsData.totalClicks}</StatNumber>
                <StatHelpText>Overall clicks recorded</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Recent Clicks</StatLabel>
                <StatNumber>{analyticsData.recentClicks}</StatNumber>
                <StatHelpText>Clicks in the last 1 day</StatHelpText>
              </Stat>
            </HStack>
          ) : (
            <Text>Loading analytics data...</Text>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
    </Box>
  );
}

export default ShortenedURLInfo;
