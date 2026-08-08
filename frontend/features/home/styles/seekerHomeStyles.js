import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Quick Services Row Styles
  servicesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  servicesScroll: {
    gap: 10,
    paddingRight: 4,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  serviceTitle: {
    color: "#1e293b",
    fontSize: 12,
    paddingRight: 4,
  },

  // Search Filter Card
  searchCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#0f172a",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  inputsWrapper: {
    gap: 12,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 30,
    height: 56,
    paddingHorizontal: 16,
  },
  selectButtonActive: {
    borderColor: "#b91c1c",
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  selectText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#0f172a",
  },
  selectTextPlaceholder: {
    color: "#94a3b8",
  },
  searchSubmitBtn: {
    height: 56,
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    backgroundColor: "#991b1b",
    ...Platform.select({
      ios: {
        shadowColor: "#991b1b",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchSubmitBtnDisabled: {
    backgroundColor: "#cbd5e1",
    elevation: 0,
    shadowOpacity: 0,
  },
  searchSubmitBtnText: {
    color: "#ffffff",
    marginLeft: 8,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  // Results Section
  resultsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 12,
  },
  resultsTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#dc2626",
    marginRight: 8,
  },
  resultsTitle: {
    fontSize: 14,
    color: "#0f172a",
  },
  badge: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: 8,
  },
  badgeText: {
    color: "#b91c1c",
    fontSize: 12,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearBtnText: {
    color: "#475569",
    fontSize: 12,
    marginLeft: 6,
  },

  // Empty State
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#1e293b",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
  },

  // Load More Button
  loadMoreBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 12,
  },
  loadMoreText: {
    color: "#334155",
    fontSize: 14,
    marginRight: 6,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalCloseBtn: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseBtnText: {
    color: "#ffffff",
    fontSize: 14,
  },
});
