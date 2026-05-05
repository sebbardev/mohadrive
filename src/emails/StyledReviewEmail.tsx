import {
  Heading,
  Text,
  Section,
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
} from "./components/MohaDriveEmailLayout";

interface StyledReviewEmailProps {
  review: {
    name: string;
    email: string;
    rating: number;
    content: string;
  };
}

export const StyledReviewEmail = ({
  review,
}: StyledReviewEmailProps) => {
  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <MohaDriveEmailLayout 
      preview={`⭐ Nouvel avis: ${review.rating}/5 étoiles par ${review.name}`}
    >
      {/* Header Section */}
      <Section style={headerSection}>
        {/* Badge */}
        <div style={badgeContainer}>
          <div style={badgeDot}></div>
          <div style={badgeDotInner}></div>
          <span style={badgeText}>Nouvel Avis</span>
        </div>
        
        {/* Titre principal */}
        <Heading style={mainHeading}>
          Avis <span className="gradient-text">client</span>
        </Heading>
        
        {/* Sous-titre */}
        <Text style={subtitle}>
          Un nouvel avis a été déposé par un client et nécessite votre modération.
        </Text>
      </Section>

      {/* Section Note */}
      <Section style={{ padding: "40px", backgroundColor: "#f8fafc", textAlign: "center" as const }}>
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(6, 102, 140, 0.08)",
          border: "1px solid rgba(6, 102, 140, 0.05)",
        }}>
          <div style={{
            fontSize: "48px",
            color: "#A4BD01",
            letterSpacing: "4px",
            marginBottom: "12px",
          }}>
            {renderStars(review.rating)}
          </div>
          <Text style={{
            fontSize: "18px",
            fontWeight: "900",
            color: "#06668C",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            margin: "0",
          }}>
            {review.rating}/5 étoiles
          </Text>
        </div>
      </Section>

      {/* Section Informations client */}
      <Section style={detailsSection}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Informations du client</Text>
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Nom</Text>
              <Text style={detailValue}>{review.name}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Email</Text>
              <Text style={detailValue}>{review.email}</Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Section Avis */}
      <Section style={{ ...detailsSection, paddingTop: "0" }}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Avis du client</Text>
          
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #A4BD01",
          }}>
            <Text style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#1C2942",
              margin: "0",
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
            }}>
              "{review.content}"
            </Text>
          </div>
        </div>
      </Section>

      {/* Section Actions */}
      <Section style={{ padding: "0 40px 40px", textAlign: "center" as const }}>
        <div style={{
          backgroundColor: "#fffbeb",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(6, 102, 140, 0.08)",
          border: "1px solid #fcd34d",
        }}>
          <Text style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#92400e",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            margin: "0 0 16px 0",
            textAlign: "center" as const,
          }}>
            En attente de modération
          </Text>
          
          <Text style={{
            fontSize: "16px",
            color: "#4a5568",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
          }}>
            Connectez-vous au dashboard pour approuver ou modérer cet avis.
          </Text>
          
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" as const }}>
            <Button
              href="https://mohadrive.ma/admin/reviews"
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
              Gérer les Avis
            </Button>
            
            <Button
              href={`mailto:${review.email}`}
              style={{
                backgroundColor: "#679436",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: "900",
                textTransform: "uppercase" as const,
                letterSpacing: "0.15em",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 4px 14px rgba(103, 148, 54, 0.3)",
              }}
            >
              Contacter le Client
            </Button>
          </div>
        </div>
      </Section>
    </MohaDriveEmailLayout>
  );
};

export default StyledReviewEmail;
