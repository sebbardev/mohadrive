import {
  Heading,
  Text,
  Section,
  Img,
  Row,
  Column,
  Hr,
  Button,
} from "@react-email/components";
import * as React from "react";
import MohaDriveEmailLayout, {
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
  whatsappButton,
  primaryButton,
} from "./components/MohaDriveEmailLayout";

interface StyledAdminBookingEmailProps {
  booking: {
    customerName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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

export const StyledAdminBookingEmail = ({
  booking,
}: StyledAdminBookingEmailProps) => {
  const carImageUrl = booking.carImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=600";
  
  return (
    <MohaDriveEmailLayout 
      preview={`🚗 Nouvelle réservation: ${booking.carBrand} ${booking.carModel}`}
    >
      {/* Header Section */}
      <Section style={headerSection}>
        {/* Badge */}
        <div style={badgeContainer}>
          <div style={badgeDot}></div>
          <div style={badgeDotInner}></div>
          <span style={badgeText}>Nouvelle Réservation</span>
        </div>
        
        {/* Titre principal */}
        <Heading style={mainHeading}>
          Nouvelle <span className="gradient-text">réservation</span>
        </Heading>
        
        {/* Sous-titre */}
        <Text style={subtitle}>
          Une nouvelle réservation a été enregistrée et nécessite votre validation.
        </Text>
      </Section>

      {/* Section Image du véhicule */}
      <Section style={{ padding: "0 40px 40px", backgroundColor: "#f8fafc" }}>
        <div style={{ 
          position: "relative", 
          borderRadius: "20px", 
          overflow: "hidden",
          boxShadow: "0 12px 24px rgba(6, 102, 140, 0.15)",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          height: "200px",
          marginBottom: "24px"
        }}>
          <Img
            src={carImageUrl}
            alt={`${booking.carBrand} ${booking.carModel}`}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover" as const 
            }}
          />
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(6, 102, 140, 0.3) 100%)",
          }}></div>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            padding: "20px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
          }}>
            <Heading style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#ffffff",
              textTransform: "uppercase" as const,
              letterSpacing: "tight",
              margin: "0 0 4px 0",
            }}>
              {booking.carBrand} {booking.carModel}
            </Heading>
            <Text style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#A4BD01",
              margin: "0",
            }}>
              {booking.totalPrice} {booking.currency || 'MAD'}
            </Text>
          </div>
        </div>
      </Section>

      {/* Section Détails client */}
      <Section style={detailsSection}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Informations client</Text>
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Nom complet</Text>
              <Text style={detailValue}>{booking.customerName}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Email</Text>
              <Text style={detailValue}>{booking.email}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Téléphone</Text>
              <Text style={detailValue}>{booking.phone}</Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Section Détails réservation */}
      <Section style={{ ...detailsSection, paddingTop: "0" }}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Détails de la réservation</Text>
          
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

      {/* Section Actions */}
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
            Connectez-vous au dashboard pour gérer cette réservation et contacter le client.
          </Text>
          
          <Button
            href="https://mohadrive.ma/admin"
            style={{
              backgroundColor: "#06668C",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: "900",
              textTransform: "uppercase" as const,
              letterSpacing: "0.15em",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 4px 14px rgba(6, 102, 140, 0.3)",
            }}
          >
            Accéder au Dashboard
          </Button>
        </div>
      </Section>
    </MohaDriveEmailLayout>
  );
};

export default StyledAdminBookingEmail;
