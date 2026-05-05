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

interface StyledPasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  expiryMinutes: number;
}

export const StyledPasswordResetEmail = ({
  userName,
  resetUrl,
  expiryMinutes,
}: StyledPasswordResetEmailProps) => {
  return (
    <MohaDriveEmailLayout 
      preview="Réinitialisation de votre mot de passe - MOHADRIVE"
    >
      {/* Header Section */}
      <Section style={headerSection}>
        {/* Badge */}
        <div style={badgeContainer}>
          <div style={badgeDot}></div>
          <div style={badgeDotInner}></div>
          <span style={badgeText}>Sécurité</span>
        </div>
        
        {/* Titre principal */}
        <Heading style={mainHeading}>
          Réinitialisation <span className="gradient-text">mot de passe</span>
        </Heading>
        
        {/* Sous-titre */}
        <Text style={subtitle}>
          Bonjour {userName}, nous avons reçu une demande de réinitialisation de votre mot de passe.
        </Text>
      </Section>

      {/* Section Instructions */}
      <Section style={detailsSection}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Instructions de réinitialisation</Text>
          
          <Text style={{
            fontSize: "16px",
            color: "#4a5568",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
          }}>
            Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous. Ce lien est valable pendant {expiryMinutes} minutes.
          </Text>
          
          <div style={{ textAlign: "center" as const, margin: "32px 0" }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#06668C",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "900",
                textTransform: "uppercase" as const,
                letterSpacing: "0.15em",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 4px 14px rgba(6, 102, 140, 0.3)",
              }}
            >
              Réinitialiser mon mot de passe
            </Button>
          </div>
          
          <Text style={{
            fontSize: "14px",
            color: "#4a5568",
            lineHeight: "1.6",
            margin: "24px 0 0 0",
            textAlign: "center" as const,
          }}>
            Ou copiez-collez ce lien dans votre navigateur :
          </Text>
          
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #e2e8f0",
            wordBreak: "break-all" as const,
            marginTop: "12px",
          }}>
            <Text style={{
              fontSize: "12px",
              color: "#06668C",
              margin: "0",
              fontFamily: "monospace",
            }}>
              {resetUrl}
            </Text>
          </div>
        </div>
      </Section>

      {/* Section Sécurité */}
      <Section style={{ padding: "0 40px 40px", textAlign: "center" as const }}>
        <div style={{
          backgroundColor: "#fffbeb",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(6, 102, 140, 0.08)",
          border: "1px solid #fcd34d",
        }}>
          <div style={{
            fontSize: "48px",
            color: "#f59e0b",
            marginBottom: "16px",
          }}>
            🔒
          </div>
          
          <Text style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#92400e",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            margin: "0 0 16px 0",
          }}>
            Informations importantes
          </Text>
          
          <div style={{ textAlign: "left" as const, marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <span style={{ color: "#f59e0b", fontWeight: "700", marginTop: "2px" }}>•</span>
              <Text style={{ fontSize: "14px", color: "#4a5568", margin: "0", flex: 1 }}>
                Ce lien expirera dans {expiryMinutes} minutes
              </Text>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <span style={{ color: "#f59e0b", fontWeight: "700", marginTop: "2px" }}>•</span>
              <Text style={{ fontSize: "14px", color: "#4a5568", margin: "0", flex: 1 }}>
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
              </Text>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ color: "#f59e0b", fontWeight: "700", marginTop: "2px" }}>•</span>
              <Text style={{ fontSize: "14px", color: "#4a5568", margin: "0", flex: 1 }}>
                Ne partagez jamais ce lien avec personne
              </Text>
            </div>
          </div>
          
          <Text style={{
            fontSize: "14px",
            color: "#4a5568",
            lineHeight: "1.6",
            margin: "0",
          }}>
            Si vous avez des questions, contactez notre support technique.
          </Text>
        </div>
      </Section>
    </MohaDriveEmailLayout>
  );
};

export default StyledPasswordResetEmail;
