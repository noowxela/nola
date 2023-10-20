import configData from "../config.json";
import { ApolloClient, InMemoryCache, createHttpLink  } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { createUploadLink } from "apollo-upload-client";
// import { Auth } from 'aws-amplify';

const authLink = setContext(async (_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// const httpLink = new HttpLink({
//   uri: configData.SERVER_URL2,
//   // uri: configData.SERVER_URL3,
// });

const httpLink  = createHttpLink ({
  // uri: configData.LOCAL_URL,
  uri: configData.STAGINGAPI_URL,
  // uri: configData.LIVE_URL,
});

// const mobyPayHttpLink = new HttpLink({
//   uri: "http://localhost:8000/graphql?",
//   // uri: "https://api.jingchengbhd.com/graphql/",
// });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink ),
  // link: authLink.concat(httpLink),
  // link: httpLink
});

export default client;

// export const saleorClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: mobyPayHttpLink,
// });
