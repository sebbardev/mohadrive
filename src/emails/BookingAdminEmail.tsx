import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface BookingAdminEmailProps {
  booking: {
    id: string;
    carName: string;
    customerName: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    phone: string;
    location: string;
  };
}

export const BookingAdminEmail = ({
  booking,
}: BookingAdminEmailProps) => (
  <Html>
    <Head />
    <Preview>Nouvelle demande de réservation pour {booking.carName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>🚗 Nouvelle Réservation</Heading>
        </Section>
        <Text style={text}>
          Une nouvelle demande de réservation vient d'être effectuée sur la plateforme.
        </Text>
        <Section style={detailsContainer}>
          <Text style={detailsTitle}>Détails de la réservation :</Text>
          <Text style={detailsText}>
            <strong>Client:</strong> {booking.customerName}<br />
            <strong>Véhicule:</strong> {booking.carName}<br />
            <strong>Période:</strong> Du {booking.startDate} au {booking.endDate}<br />
            <strong>Lieu:</strong> {booking.location}<br />
            <strong>Prix Total:</strong> {booking.totalPrice} DH<br />
            <strong>Téléphone:</strong> {booking.phone}
          </Text>
        </Section>
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/reservations`}
          >
            Accéder au Dashboard
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          MOHADRIVE Location de Voitures - Dashboard Administration
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BookingAdminEmail;

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
  color: "#1A3B5D",
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

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const button = {
  backgroundColor: "#7CB342",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
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
