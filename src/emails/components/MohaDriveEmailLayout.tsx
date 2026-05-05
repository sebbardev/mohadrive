import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Font,
  Row,
  Column,
  Img,
  Hr,
  Button,
} from "@react-email/components";
import * as React from "react";

interface MohaDriveEmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  subject?: string;
}

export const MohaDriveEmailLayout = ({ 
  children, 
  preview = "MOHADRIVE - Location Premium au Maroc",
  subject 
}: MohaDriveEmailLayoutProps) => {
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif";

  return (
    <Html>
      <Head>
        <Font
          fontFamily={fontFamily}
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily={fontFamily}
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={900}
          fontStyle="normal"
        />
        <style>
          {`
            /* Variables CSS MOHADRIVE */
            :root {
              --color-primary: #06668C;
              --color-secondary: #427AA1;
              --color-bg: #EBF2FA;
              --color-accent: #679436;
              --color-highlight: #A4BD01;
              --color-text-main: #1C2942;
              --color-text-muted: #4a5568;
              --color-white: #ffffff;
            }
            
            .gradient-text {
              background: linear-gradient(135deg, #06668C, #427AA1, #A4BD01);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .badge-glow {
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
            
            @keyframes ping {
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            
            .section-tag {
              font-size: 10px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.3em;
              color: #A4BD01;
              margin-bottom: 20px;
              display: block;
            }
            
            .main-heading {
              font-size: 42px;
              font-weight: 900;
              line-height: 1.1;
              text-transform: uppercase;
              letter-spacing: -0.02em;
              color: #06668C;
            }
            
            .subtitle {
              font-size: 16px;
              color: #4a5568;
              line-height: 1.6;
              margin: 0 auto;
              max-width: 500px;
            }
            
            .detail-label {
              font-size: 10px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              color: #4a5568;
              margin-bottom: 4px;
              display: block;
            }
            
            .detail-value {
              font-size: 14px;
              font-weight: 600;
              color: #1C2942;
              margin: 0;
            }
            
            .moha-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 14px 28px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              text-decoration: none;
              transition: all 0.3s ease;
              cursor: pointer;
              border: none;
            }
            
            .moha-button-primary {
              background: linear-gradient(135deg, #06668C, #427AA1);
              color: #ffffff;
              box-shadow: 0 4px 20px rgba(6, 102, 140, 0.3);
            }
            
            .moha-button-accent {
              background: linear-gradient(135deg, #679436, #A4BD01);
              color: #ffffff;
              box-shadow: 0 4px 20px rgba(103, 148, 54, 0.3);
            }
            
            .trust-badge {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 12px;
              font-weight: 600;
              color: #4a5568;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            
            .trust-icon {
              color: #679436;
              font-weight: 700;
              font-size: 14px;
            }
            
            .car-image-container {
              position: relative;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(6, 102, 140, 0.2);
              border: 2px solid rgba(255, 255, 255, 0.5);
              height: 300px;
              margin-bottom: 20px;
            }
            
            .car-image-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(6, 102, 140, 0.3) 100%);
            }
            
            .car-info-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              padding: 24px;
              background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
            }
            
            .car-name-heading {
              font-size: 28px;
              font-weight: 900;
              color: #ffffff;
              text-transform: uppercase;
              letter-spacing: -0.02em;
              margin: 0 0 8px 0;
            }
            
            .car-price-text {
              font-size: 18px;
              font-weight: 700;
              color: #A4BD01;
              margin: 0;
            }
          `}
        </style>
      </Head>
      <Preview>{preview}</Preview>
      
      <Body style={main}>
        {/* Background avec décoration */}
        <div style={backgroundDecor}>
          <Container style={container}>
            {/* Header avec logo */}
            <Section style={headerSection}>
              <div style={logoContainer}>
                <div style={logoText}>
                  <span style={logoMain}>MOHADRIVE</span>
                  <span style={logoSub}>location de voitures</span>
                </div>
              </div>
            </Section>
            
            {children}
            
            {/* Footer universel */}
            <Section style={footerSection}>
              <div style={footerDivider}></div>
              <div style={footerText}>
                <strong>MOHADRIVE Location Premium</strong><br />
                Service Client - Merci de votre confiance !<br />
                <span style={footerSmall}>Boulevard Mohamed VI, El Aïoun Sidi Mellouk, Maroc</span>
              </div>
            </Section>
          </Container>
        </div>
      </Body>
    </Html>
  );
};

// Styles réutilisables
export const main = {
  backgroundColor: "#EBF2FA",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
  margin: 0,
  padding: 0,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

export const backgroundDecor = {
  position: "relative" as const,
  backgroundColor: "#EBF2FA",
  backgroundImage: `radial-gradient(circle at 20% 80%, rgba(6, 102, 140, 0.05) 0%, transparent 50%), 
                    radial-gradient(circle at 80% 20%, rgba(164, 189, 1, 0.08) 0%, transparent 50%), 
                    radial-gradient(circle at 40% 40%, rgba(103, 148, 54, 0.03) 0%, transparent 50%)`,
};

export const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  borderRadius: "32px",
  boxShadow: "0 20px 60px rgba(6, 102, 140, 0.15)",
  overflow: "hidden",
  maxWidth: "700px",
};

export const headerSection = {
  padding: "40px 40px 20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  textAlign: "center" as const,
};

export const logoContainer = {
  display: "flex",
  justifyContent: "center" as const,
  alignItems: "center",
};

export const logoText = {
  display: "flex",
  flexDirection: "column" as const,
  textAlign: "left" as const,
};

export const logoMain = {
  fontSize: "28px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "-0.02em",
  color: "#06668C",
  lineHeight: "1",
};

export const logoSub = {
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  color: "#A4BD01",
  lineHeight: "1",
  marginTop: "4px",
};

// Styles pour les boutons type Navbar
export const whatsappButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "linear-gradient(135deg, #679436, #A4BD01)",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "16px",
  fontSize: "12px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  textDecoration: "none" as const,
  boxShadow: "0 4px 20px rgba(103, 148, 54, 0.3)",
  transition: "all 0.3s ease",
};

export const whatsappButtonHover = {
  background: "linear-gradient(135deg, #A4BD01, #679436)",
  transform: "translateY(-2px)",
  boxShadow: "0 8px 30px rgba(103, 148, 54, 0.4)",
};

export const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "linear-gradient(135deg, #06668C, #427AA1)",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "16px",
  fontSize: "12px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  textDecoration: "none" as const,
  boxShadow: "0 4px 20px rgba(6, 102, 140, 0.3)",
  transition: "all 0.3s ease",
};

export const primaryButtonHover = {
  background: "linear-gradient(135deg, #427AA1, #06668C)",
  transform: "translateY(-2px)",
  boxShadow: "0 8px 30px rgba(6, 102, 140, 0.4)",
};

export const badgeContainer = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(16px)",
  padding: "8px 20px",
  borderRadius: "9999px",
  boxShadow: "0 4px 20px rgba(6, 102, 140, 0.1)",
  border: "1px solid rgba(6, 102, 140, 0.1)",
  marginBottom: "24px",
};

export const badgeDot = {
  position: "relative" as const,
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: "#A4BD01",
};

export const badgeDotInner = {
  position: "absolute" as const,
  top: "0",
  left: "0",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: "linear-gradient(135deg, #A4BD01, #679436)",
  animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
};

export const badgeText = {
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  color: "#06668C",
};

export const mainHeading = {
  fontSize: "42px",
  fontWeight: "900",
  color: "#06668C",
  textTransform: "uppercase" as const,
  letterSpacing: "-0.02em",
  lineHeight: "1.1",
  margin: "0 0 24px 0",
};

export const subtitle = {
  fontSize: "16px",
  color: "#4a5568",
  lineHeight: "1.6",
  margin: "0 auto",
  maxWidth: "500px",
};

export const sectionTag = {
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  color: "#A4BD01",
  marginBottom: "20px",
  display: "block",
};

export const detailsSection = {
  padding: "40px",
  backgroundColor: "#f8fafc",
};

export const detailsContainer = {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "32px",
  boxShadow: "0 4px 20px rgba(6, 102, 140, 0.08)",
  border: "1px solid rgba(6, 102, 140, 0.05)",
};

export const detailLabel = {
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  color: "#4a5568",
  marginBottom: "4px",
  display: "block",
};

export const detailValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1C2942",
  margin: "0",
};

export const detailDivider = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "16px 0",
};

export const footerSection = {
  padding: "40px",
  textAlign: "center" as const,
  backgroundColor: "#ffffff",
  borderTop: "1px solid #e2e8f0",
};

export const footerDivider = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "0 0 24px 0",
};

export const footerText = {
  fontSize: "12px",
  color: "#8898aa",
  lineHeight: "1.5",
  margin: "0",
};

export const footerSmall = {
  fontSize: "10px",
  opacity: 0.8,
};

// Composants réutilisables pour les boutons style MOHADRIVE
interface MohaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "accent";
  className?: React.CSSProperties;
}

export const MohaButton = ({ href, children, variant = "primary", className = {} }: MohaButtonProps) => {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 28px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    textDecoration: "none" as const,
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "none",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #06668C, #427AA1)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(6, 102, 140, 0.3)",
    },
    accent: {
      background: "linear-gradient(135deg, #679436, #A4BD01)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(103, 148, 54, 0.3)",
    },
  };

  return (
    <a href={href} style={{ ...baseStyles, ...variants[variant], ...className }}>
      {children}
    </a>
  );
};

// Composant pour les badges de confiance
interface TrustBadgeProps {
  children: React.ReactNode;
}

export const TrustBadge = ({ children }: TrustBadgeProps) => {
  return (
    <div style={trustBadge}>
      <span style={trustIcon}>✓</span>
      <span>{children}</span>
    </div>
  );
};

// Composant pour les images de voitures avec overlay
interface CarImageSectionProps {
  imageUrl: string;
  carName: string;
  price: string;
}

export const CarImageSection = ({ imageUrl, carName, price }: CarImageSectionProps) => {
  return (
    <div style={{ padding: "0 40px 40px", backgroundColor: "#f8fafc" }}>
      <div style={carImageContainer}>
        <div style={{ position: "relative", height: "300px" }}>
          <Img
            src={imageUrl}
            alt={carName}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover" as const,
              borderRadius: "24px"
            }}
          />
          <div style={carImageOverlay} />
          <div style={carInfoOverlay}>
            <h3 style={carNameHeading}>{carName}</h3>
            <p style={carPriceText}>{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles pour les nouveaux composants
export const trustBadge = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#4a5568",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export const trustIcon = {
  color: "#679436",
  fontWeight: "700",
  fontSize: "14px",
};

export const carImageContainer = {
  position: "relative" as const,
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(6, 102, 140, 0.2)",
  border: "2px solid rgba(255, 255, 255, 0.5)",
  marginBottom: "20px",
};

export const carImageOverlay = {
  position: "absolute" as const,
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(6, 102, 140, 0.3) 100%)",
  borderRadius: "24px",
};

export const carInfoOverlay = {
  position: "absolute" as const,
  top: "0",
  left: "0",
  right: "0",
  padding: "24px",
  background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
  borderRadius: "24px 24px 0 0",
};

export const carNameHeading = {
  fontSize: "28px",
  fontWeight: "900",
  color: "#ffffff",
  textTransform: "uppercase" as const,
  letterSpacing: "-0.02em",
  margin: "0 0 8px 0",
};

export const carPriceText = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#A4BD01",
  margin: "0",
};

export default MohaDriveEmailLayout;
