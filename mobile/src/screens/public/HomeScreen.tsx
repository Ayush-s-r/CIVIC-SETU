import React, { useState } from "react";
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions,
  StatusBar,
  Platform
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../ui/Button";
import type { PublicStackParamList } from "../../navigation/PublicStack";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<PublicStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (route: keyof PublicStackParamList) => {
    setMenuOpen(false);
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Fixed Navbar */}
      <View style={styles.navbar}>
        {/* Left - Logo and Brand */}
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>CS</Text>
            </View>
            <View style={styles.brand}>
              <Text style={styles.brandTitle}>CivicSetu</Text>
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={12} color="#3b82f6" />
                <Text style={styles.verifiedText}>Govt Portal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Center - Navigation Links (Hidden on Mobile) */}
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => go("Home")} style={styles.navLink}>
            <Icon name="home" size={16} color="#4b5563" />
            <Text style={styles.navLinkText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("About")} style={styles.navLink}>
            <Icon name="info" size={16} color="#4b5563" />
            <Text style={styles.navLinkText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("Contact")} style={styles.navLink}>
            <Icon name="contact-mail" size={16} color="#4b5563" />
            <Text style={styles.navLinkText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("Complaint")} style={[styles.navLink, styles.reportLink]}>
            <Icon name="report-problem" size={16} color="#dc2626" />
            <Text style={[styles.navLinkText, styles.reportText]}>Report</Text>
          </TouchableOpacity>
        </View>

        {/* Right - Security Badge, Login Button and Hamburger */}
        <View style={styles.navRight}>
          <View style={styles.securityBadge}>
            <Icon name="security" size={14} color="#059669" />
            <Text style={styles.securityText}>Secure</Text>
          </View>
          
          <View style={styles.loginButtonWrapper}>
            <Button 
              title="Login" 
              onPress={() => go("Login")}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.hamburger} 
            onPress={() => setMenuOpen((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={styles.hamburgerBar} />
            <View style={styles.hamburgerBar} />
            <View style={styles.hamburgerBar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <View style={styles.menuOverlay}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderTitle}>Menu</Text>
            <TouchableOpacity onPress={() => setMenuOpen(false)} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => go("Home")} style={styles.menuItem}>
            <Icon name="home" size={20} color="#3b82f6" />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("About")} style={styles.menuItem}>
            <Icon name="info" size={20} color="#3b82f6" />
            <Text style={styles.menuItemText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("Contact")} style={styles.menuItem}>
            <Icon name="contact-mail" size={20} color="#3b82f6" />
            <Text style={styles.menuItemText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("Complaint")} style={[styles.menuItem, styles.menuReportItem]}>
            <Icon name="report-problem" size={20} color="#dc2626" />
            <Text style={[styles.menuItemText, styles.menuReportText]}>Report Issue</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity onPress={() => go("Login")} style={styles.menuItem}>
            <Icon name="login" size={20} color="#3b82f6" />
            <Text style={styles.menuItemText}>Login / Sign up</Text>
          </TouchableOpacity>
          <View style={styles.menuFooter}>
            <Icon name="verified-user" size={14} color="#059669" />
            <Text style={styles.menuFooterText}>Secure Government Portal</Text>
          </View>
        </View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Icon name="verified" size={16} color="#3b82f6" />
            <Text style={styles.heroBadgeText}>Official Government Platform</Text>
          </View>
          <Text style={styles.heroTitle}>
            Digital Civic Issue{' '}
            <Text style={styles.heroHighlight}>Resolution Platform</Text>
          </Text>
          <Text style={styles.heroText}>
            A secure, transparent, and efficient platform for citizens to report civic issues 
            and track their resolution in real-time with end-to-end encryption.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Issues Resolved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24h</Text>
              <Text style={styles.statLabel}>Avg. Response</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>Departments</Text>
            </View>
          </View>
          <View style={styles.heroActions}>
            <Button 
              title="Report New Issue" 
              onPress={() => go("Complaint")}
              style={styles.primaryButton}
            />
            <Button 
              title="Track Issues" 
              variant="secondary" 
              onPress={() => go("Login")}
              style={styles.secondaryButton}
            />
          </View>
        </View>

        {/* Quick Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Services</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardGrid}>
            {[
              {
                icon: "road",
                title: "Road & Infrastructure",
                desc: "Report potholes, road damage, and infrastructure issues.",
                color: "#3b82f6"
              },
              {
                icon: "lightbulb",
                title: "Street Lighting",
                desc: "Report faulty street lights and lighting issues.",
                color: "#f59e0b"
              },
              {
                icon: "water-drop",
                title: "Water Supply",
                desc: "Report water leakage, supply issues, and quality concerns.",
                color: "#059669"
              },
              {
                icon: "delete",
                title: "Sanitation",
                desc: "Report garbage collection, drainage, and sanitation issues.",
                color: "#dc2626"
              },
            ].map((card) => (
              <View key={card.title} style={styles.card}>
                <View style={[styles.cardIcon, { backgroundColor: `${card.color}10` }]}>
                  <Icon name={card.icon} size={24} color={card.color} />
                </View>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardBody}>{card.desc}</Text>
                <TouchableOpacity 
                  style={styles.cardButton}
                  onPress={() => go("Complaint")}
                >
                  <Text style={[styles.cardButtonText, { color: card.color }]}>
                    Report Issue
                  </Text>
                  <Icon name="arrow-forward" size={16} color={card.color} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.timeline}>
            {[
              {
                step: "01",
                title: "Register & Verify",
                desc: "Create your account with Aadhaar-linked verification for secure access.",
                icon: "how-to-reg"
              },
              {
                step: "02",
                title: "Report Issue",
                desc: "Submit detailed information with photos and precise location mapping.",
                icon: "add-location"
              },
              {
                step: "03",
                title: "Track Progress",
                desc: "Monitor real-time status with department updates and timelines.",
                icon: "track-changes"
              },
              {
                step: "04",
                title: "Get Resolved",
                desc: "Receive official confirmation with resolution documentation.",
                icon: "check-circle"
              },
            ].map((item, index) => (
              <View key={item.step} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineIcon}>
                    <Icon name={item.icon} size={24} color="#3b82f6" />
                  </View>
                  {index < 3 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStep}>{item.step}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Login Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Access Government Services</Text>
            <View style={styles.securityChip}>
              <Icon name="lock" size={14} color="#059669" />
              <Text style={styles.securityChipText}>Encrypted</Text>
            </View>
          </View>
          <View style={styles.loginCards}>
            <View style={[styles.loginCard, styles.citizenCard]}>
              <View style={styles.loginCardHeader}>
                <View style={styles.loginIconContainer}>
                  <Icon name="person" size={28} color="#3b82f6" />
                </View>
                <View style={styles.loginBadge}>
                  <Text style={styles.loginBadgeText}>Most Used</Text>
                </View>
              </View>
              <Text style={styles.loginTitle}>Citizen Portal</Text>
              <Text style={styles.loginBody}>
                Report and track issues, access services, and receive updates from your personalized dashboard.
              </Text>
              <View style={styles.loginFeatures}>
                <View style={styles.loginFeature}>
                  <Icon name="check-circle" size={16} color="#059669" />
                  <Text style={styles.loginFeatureText}>24/7 Access</Text>
                </View>
                <View style={styles.loginFeature}>
                  <Icon name="check-circle" size={16} color="#059669" />
                  <Text style={styles.loginFeatureText}>Real-time Updates</Text>
                </View>
              </View>
              <Button 
                title="Citizen Login" 
                onPress={() => go("Login")}
                style={styles.citizenButton}
              />
            </View>

            <View style={[styles.loginCard, styles.adminCard]}>
              <View style={styles.loginCardHeader}>
                <View style={[styles.loginIconContainer, styles.adminIcon]}>
                  <Icon name="security" size={28} color="#7c3aed" />
                </View>
                <View style={[styles.loginBadge, styles.adminBadge]}>
                  <Text style={[styles.loginBadgeText, styles.adminBadgeText]}>Restricted</Text>
                </View>
              </View>
              <Text style={styles.loginTitle}>Official Portal</Text>
              <Text style={styles.loginBody}>
                Secure access for authorized staff and administrators with multi-factor authentication.
              </Text>
              <View style={styles.loginFeatures}>
                <View style={styles.loginFeature}>
                  <Icon name="verified-user" size={16} color="#7c3aed" />
                  <Text style={styles.loginFeatureText}>2FA Required</Text>
                </View>
                <View style={styles.loginFeature}>
                  <Icon name="admin-panel-settings" size={16} color="#7c3aed" />
                  <Text style={styles.loginFeatureText}>Admin Access</Text>
                </View>
              </View>
              <Button 
                title="Official Login" 
                variant="secondary"
                onPress={() => go("Login")}
                style={styles.adminButton}
              />
            </View>
          </View>
        </View>

        {/* Fixed Trust Badges Footer */}
        <View style={styles.trustFooter}>
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Icon name="verified-user" size={18} color="#059669" />
              <Text style={styles.trustText}>Govt Verified</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Icon name="lock" size={18} color="#059669" />
              <Text style={styles.trustText}>AES-256 Encrypted</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Icon name="gpp-good" size={18} color="#059669" />
              <Text style={styles.trustText}>ISO Certified</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: "#f8fafc" 
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 60,
  },
  brandContainer: {
    flexShrink: 1,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  brand: {
    flexDirection: "column",
  },
  brandTitle: { 
    fontSize: 16, 
    fontWeight: "700",
    color: "#0f172a",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  verifiedText: { 
    fontSize: 10, 
    color: "#3b82f6",
    marginLeft: 2,
    fontWeight: "500",
  },
  navLinks: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    display: width > 768 ? 'flex' : 'none', // Hide on mobile
  },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  navLinkText: { 
    fontSize: 13, 
    color: "#334155",
    fontWeight: "500",
  },
  reportLink: {
    backgroundColor: "#fee2e2",
  },
  reportText: {
    color: "#dc2626",
  },
  navRight: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
    flexShrink: 0,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
    display: width > 768 ? 'flex' : 'none', // Hide on mobile
  },
  securityText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  loginButtonWrapper: {
    minWidth: 65,
  },
  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  loginButtonText: {
    fontSize: 12,
  },
  hamburger: { 
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginLeft: 4,
  },
  hamburgerBar: { 
    width: 18, 
    height: 2, 
    backgroundColor: "#334155", 
    marginVertical: 2, 
    borderRadius: 2,
  },
  menuOverlay: {
    position: "absolute",
    top: 70,
    right: 16,
    left: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  menuHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  closeButton: {
    padding: 4,
  },
  menuItem: { 
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
    borderRadius: 8,
  },
  menuItemText: { 
    fontSize: 15, 
    color: "#334155",
    fontWeight: "500",
  },
  menuReportItem: {
    backgroundColor: "#fee2e2",
  },
  menuReportText: {
    color: "#dc2626",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  menuFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  menuFooterText: {
    fontSize: 11,
    color: "#64748b",
  },
  scroll: { 
    padding: 16, 
    paddingBottom: 20, 
  },
  hero: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "600",
  },
  heroTitle: { 
    fontSize: 24, 
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  heroHighlight: {
    color: "#3b82f6",
  },
  heroText: { 
    fontSize: 14, 
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e2e8f0",
  },
  heroActions: { 
    flexDirection: "row", 
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 8,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 8,
  },
  section: { 
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700",
    color: "#0f172a",
  },
  viewAllText: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: "600",
  },
  cardGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 10,
  },
  card: {
    width: (width - 42) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { 
    fontSize: 15, 
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardBody: { 
    fontSize: 12, 
    color: "#64748b",
    lineHeight: 16,
    marginBottom: 10,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  timeline: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 14,
  },
  timelineIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineStep: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "600",
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  securityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  securityChipText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  loginCards: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 10,
  },
  loginCard: {
    width: (width - 42) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  citizenCard: {
    borderTopWidth: 3,
    borderTopColor: "#3b82f6",
  },
  adminCard: {
    borderTopWidth: 3,
    borderTopColor: "#7c3aed",
  },
  loginCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  loginIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  adminIcon: {
    backgroundColor: "#f5f3ff",
  },
  loginBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  adminBadge: {
    backgroundColor: "#ede9fe",
  },
  loginBadgeText: {
    fontSize: 10,
    color: "#3b82f6",
    fontWeight: "600",
  },
  adminBadgeText: {
    color: "#7c3aed",
  },
  loginTitle: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  loginBody: { 
    fontSize: 12, 
    color: "#64748b",
    lineHeight: 16,
    marginBottom: 14,
  },
  loginFeatures: {
    gap: 6,
    marginBottom: 16,
  },
  loginFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loginFeatureText: {
    fontSize: 12,
    color: "#334155",
  },
  citizenButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
  },
  adminButton: {
    borderColor: "#7c3aed",
    paddingVertical: 8,
  },
  trustFooter: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: '100%',
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "500",
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#e2e8f0",
  },
});

export default HomeScreen;