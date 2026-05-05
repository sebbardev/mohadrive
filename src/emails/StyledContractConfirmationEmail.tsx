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

interface StyledContractConfirmationEmailProps {
  contract: {
    id: string;
    driverFirstName: string;
    driverLastName: string;
    driverEmail: string;
    carBrand: string;
    carModel: string;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    returnLocation: string;
    totalPrice: number;
    currency?: string;
    pdfPath?: string;
  };
}

export const StyledContractConfirmationEmail = ({
  contract,
}: StyledContractConfirmationEmailProps) => {
  return (
    <MohaDriveEmailLayout 
      preview={`Confirmation de votre contrat de location - ${contract.id}`}
    >
      {/* Header Section */}
      <Section style={headerSection}>
        {/* Badge */}
        <div style={badgeContainer}>
          <div style={badgeDot}></div>
          <div style={badgeDotInner}></div>
          <span style={badgeText}>Contrat Confirmé</span>
        </div>
        
        {/* Titre principal */}
        <Heading style={mainHeading}>
          Votre <span className="gradient-text">contrat</span> est prêt
        </Heading>
        
        {/* Sous-titre */}
        <Text style={subtitle}>
          Nous avons le plaisir de vous confirmer la création de votre contrat de location pour le véhicule <strong>{contract.carBrand} {contract.carModel}</strong>.
        </Text>
      </Section>

      {/* Section Détails du contrat */}
      <Section style={detailsSection}>
        <div style={detailsContainer}>
          <Text style={sectionTag}>Détails de la location</Text>
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Véhicule</Text>
              <Text style={detailValue}>{contract.carBrand} {contract.carModel}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Départ</Text>
              <Text style={detailValue}>{contract.startDate}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Retour</Text>
              <Text style={detailValue}>{contract.endDate}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Lieu de départ</Text>
              <Text style={detailValue}>{contract.pickupLocation}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Lieu de retour</Text>
              <Text style={detailValue}>{contract.returnLocation}</Text>
            </Column>
          </Row>
          
          <Hr style={detailDivider} />
          
          <Row>
            <Column style={{ padding: "0" }}>
              <Text style={detailLabel}>Montant total</Text>
              <Text style={detailValue} className="gradient-text">
                {contract.totalPrice} {contract.currency || 'MAD'}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Section Document */}
      <Section style={{ padding: "0 40px 40px", textAlign: "center" as const }}>
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(6, 102, 140, 0.08)",
          border: "1px solid rgba(6, 102, 140, 0.05)",
        }}>
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            border: "2px dashed #06668C",
          }}>
            <div style={{
              fontSize: "48px",
              color: "#06668C",
              marginBottom: "16px",
            }}>
              📄
            </div>
            <Text style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#06668C",
              margin: "0 0 8px 0",
            }}>
              Contrat de Location
            </Text>
            <Text style={{
              fontSize: "14px",
              color: "#4a5568",
              margin: "0",
            }}>
              Vous trouverez ci-joint votre contrat de location au format PDF
            </Text>
          </div>
          
          <Text style={{
            fontSize: "16px",
            color: "#4a5568",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
          }}>
            Merci de votre confiance et à très bientôt pour votre location !
          </Text>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#679436", fontWeight: "700" }}>✓</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>Contrat signé</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#679436", fontWeight: "700" }}>✓</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>PDF inclus</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#679436", fontWeight: "700" }}>✓</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>Validé</span>
            </div>
          </div>
        </div>
      </Section>
    </MohaDriveEmailLayout>
  );
};

export default StyledContractConfirmationEmail;
