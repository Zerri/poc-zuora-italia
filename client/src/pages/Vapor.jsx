import React from 'react';
import VaporThemeProvider from "@vapor/v3-components/styles";
import VaporPage from "@vapor/v3-components/VaporPage";
import Typography from "@vapor/v3-components/Typography";
import Button from "@vapor/v3-components/Button";

function Vapor() {
  return (
    <VaporThemeProvider>
      <VaporPage
        title="My First Vapor App"
        subtitle="This is a Subtitle"
      >
        <VaporPage.Section>
          <Typography>Here is a Vapor button:</Typography>
          <Button variant="contained">Just a button</Button>
        </VaporPage.Section>
      </VaporPage>
    </VaporThemeProvider>

  );
}

export default Vapor;