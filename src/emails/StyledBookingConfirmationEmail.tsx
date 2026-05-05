import {
  Heading,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import * as React from "react";
import MohaDriveEmailLayout, {
  MohaButton,
  TrustBadge,
  CarImageSection,
  headerSection,
  badgeContainer,
  badgeDot,
  badgeDotInner,
  badgeText,
  mainHeading,
  subtitle,
  sectionTag,
  detailsSection,
  detailsContainer,
  detailLabel,
  detailValue,
  detailDivider,
} from "./components/MohaDriveEmailLayout";

interface StyledBookingConfirmationEmailProps {
  booking: {
    customerName: string;
    firstName: string;
    lastName: string;
    email: string;
    carName: string;
    carBrand: string;
    carModel: string;
    carImage?: string;
    startDate: string;
    endDate: string;
    location: string;
    totalPrice: number;
    currency?: string;
  };
}

export const StyledBookingConfirmationEmail = ({
  booking,
}: StyledBookingConfirmationEmailProps) => {
  const carImageUrl = booking.carImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=600";
  
  return (
    <MohaDriveEmailLayout 
      preview="✅ Réservation Confirmée - MOHADRIVE Location Premium"
    >
      {/* Header Section */}
      <Section style={headerSection}>
        {/* Badge animé */}
        <div style={badgeContainer}>
          <div style={badgeDot}></div>
          <div style={badgeDotInner}></div>
          <span style={badgeText}>Réservation Confirmée</span>
        </div>
        
        {/* Titre principal */}
        <Heading style={mainHeading}>
          Votre <span className="gradient-text">aventure</span> commence
        </Heading>
        
        {/* Sous-titre */}
        <Text style={subtitle}>
          Bonne nouvelle ! Votre demande de réservation pour le véhicule{" "}
          <strong>{booking.carBrand} {booking.carModel}</strong> a été acceptée par notre équipe premium.
        </Text>
      </Section>

      {/* Section Image du véhicule style MOHADRIVE */}
      <CarImageSection 
        imageUrl={carImageUrl}
        carName={`${booking.carBrand} ${booking.carModel}`}
        price={`${booking.totalPrice} ${booking.currency || 'MAD'}`}
      />

      {/* Section Détails de la réservation */}
      <Section style={detailsSection}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Récapitulatif de votre location</Text>
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Véhicule</Text>
              <Text style={detailValue}>{booking.carBrand} {booking.carModel}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Prise en charge</Text>
              <Text style={detailValue}>{booking.startDate}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Dépôt</Text>
              <Text style={detailValue}>{booking.endDate}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Lieu</Text>
              <Text style={detailValue}>{booking.location}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Prix total</Text>
              <Text style={detailValue} className="gradient-text">
                {booking.totalPrice} {booking.currency || 'MAD'}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Section Message et CTA style MOHADRIVE */}
      <Section style={{ padding: "0 40px 40px", textAlign: "center" as const }}>
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(6, 102, 140, 0.08)",
          border: "1px solid rgba(6, 102, 140, 0.05)",
        }}>
          <Text style={{
            fontSize: "16px",
            color: "#4a5568",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
          }}>
            Notre agent vous contactera sous peu pour finaliser les détails de la livraison et répondre à toutes vos questions.
          </Text>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" as const, marginBottom: "24px" }}>
            <TrustBadge>Annulation gratuite</TrustBadge>
            <TrustBadge>Livraison aéroport</TrustBadge>
            <TrustBadge>Assurance incluse</TrustBadge>
          </div>
          
          {/* Boutons d'action style MOHADRIVE */}
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" as const }}>
            <MohaButton 
              href="https://wa.me/212600000000" 
              variant="accent"
            >
              <span style={{ fontSize: "14px" }}>📞</span>
              WhatsApp
            </MohaButton>
            <MohaButton 
              href="tel:+212600000000" 
              variant="primary"
            >
              <span style={{ fontSize: "14px" }}>📱</span>
              Appeler
            </MohaButton>
          </div>
        </div>
      </Section>
    </MohaDriveEmailLayout>
  );
};

export default StyledBookingConfirmationEmail;
