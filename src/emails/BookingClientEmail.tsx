import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface BookingClientEmailProps {
  booking: {
    customerName: string;
    carName: string;
    startDate: string;
    endDate: string;
    location: string;
  };
}

export const BookingClientEmail = ({
  booking,
}: BookingClientEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmation de votre réservation - MOHADRIVE Location de Voitures</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>✅ Réservation Confirmée</Heading>
        </Section>
        <Text style={text}>
          Bonjour {booking.customerName},
        </Text>
        <Text style={text}>
          Bonne nouvelle ! Votre demande de réservation pour la <strong>{booking.carName}</strong> a été acceptée par notre équipe.
        </Text>
        <Section style={detailsContainer}>
          <Text style={detailsTitle}>Récapitulatif de votre location :</Text>
          <Text style={detailsText}>
            <strong>Véhicule:</strong> {booking.carName}<br />
            <strong>Prise en charge:</strong> {booking.startDate}<br />
            <strong>Dépôt:</strong> {booking.endDate}<br />
            <strong>Lieu:</strong> {booking.location}
          </Text>
        </Section>
        <Text style={text}>
          Notre agent vous contactera sous peu pour finaliser les détails de la livraison.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          MOHADRIVE Location de Voitures - Service Client<br />
          Merci de votre confiance !
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BookingClientEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const headerSection = {
  borderBottom: "1px solid #eee",
  paddingBottom: "20px",
  marginBottom: "20px",
};

const h1 = {
  color: "#7CB342",
  fontSize: "24px",
  fontWeight: "900",
  textAlign: "center" as const,
  margin: "0",
  textTransform: "uppercase" as const,
  fontStyle: "italic",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const detailsContainer = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
};

const detailsTitle = {
  color: "#1A3B5D",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  marginBottom: "10px",
};

const detailsText = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "22px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
