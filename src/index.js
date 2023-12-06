import React from "react";

import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";

const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
);
