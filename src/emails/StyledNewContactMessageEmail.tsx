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

interface StyledNewContactMessageEmailProps {
  contactMessage: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: string;
  };
}

export const StyledNewContactMessageEmail = ({
  contactMessage,
}: StyledNewContactMessageEmailProps) => {
  return (
    <MohaDriveEmailLayout 
      preview={`Nouveau message de contact - ${contactMessage.subject}`}
    >
      {/* Header Section */}
      <Section style={headerSection}>
        {/* Badge */}
        <div style={badgeContainer}>
          <div style={badgeDot}></div>
          <div style={badgeDotInner}></div>
          <span style={badgeText}>Nouveau Message</span>
        </div>
        
        {/* Titre principal */}
        <Heading style={mainHeading}>
          Message <span className="gradient-text">contact</span>
        </Heading>
        
        {/* Sous-titre */}
        <Text style={subtitle}>
          Un nouveau message a été reçu depuis le formulaire de contact du site web.
        </Text>
      </Section>

      {/* Section Informations expéditeur */}
      <Section style={detailsSection}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Informations de l'expéditeur</Text>
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Nom</Text>
              <Text style={detailValue}>{contactMessage.name}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Email</Text>
              <Text style={detailValue}>{contactMessage.email}</Text>
            </Column>
          </Row>
          
          {contactMessage.phone && (
            <>
              <Hr style={detailDivider} />
              
              <Row>
                <Column style={{ padding: "0" }}>
                  <Text style={detailLabel}>Téléphone</Text>
                  <Text style={detailValue}>{contactMessage.phone}</Text>
                </Column>
              </Row>
            </>
          )}
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Sujet</Text>
              <Text style={detailValue}>{contactMessage.subject}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Date</Text>
              <Text style={detailValue}>{contactMessage.createdAt}</Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Section Message */}
      <Section style={{ ...detailsSection, paddingTop: "0" }}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Message du client</Text>
          
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #06668C",
          }}>
            <Text style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#1C2942",
              margin: "0",
              whiteSpace: "pre-wrap",
            }}>
              {contactMessage.message}
            </Text>
          </div>
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
            Répondez rapidement à ce message pour offrir un service client exceptionnel.
          </Text>
          
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" as const }}>
            <Button
              href={`mailto:${contactMessage.email}?subject=Re: ${encodeURIComponent(contactMessage.subject)}`}
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
              Répondre par Email
            </Button>
            
            {contactMessage.phone && (
              <Button
                href={`tel:${contactMessage.phone}`}
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
                Appeler
              </Button>
            )}
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "24px", 
            marginTop: "24px",
            flexWrap: "wrap" as const 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#679436", fontWeight: "700" }}>⚡</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>Réponse rapide</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#679436", fontWeight: "700" }}>🎯</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>Service client</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#679436", fontWeight: "700" }}>✓</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>Qualité</span>
            </div>
          </div>
        </div>
      </Section>
    </MohaDriveEmailLayout>
  );
};

export default StyledNewContactMessageEmail;
