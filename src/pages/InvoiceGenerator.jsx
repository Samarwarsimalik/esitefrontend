import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { Download } from "lucide-react"; // Lucide icon

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  shopInfo: {
    fontSize: 10,
    color: "#555",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 10,
    textAlign: "center",
  },
  orderInfo: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
  },
  billTo: {
    marginBottom: 15,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    fontWeight: "bold",
    color: "#444",
  },
  tableCell: {
    borderRightColor: "#ddd",
    borderRightWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    padding: 8,
    fontSize: 10,
  },
  colNum: {
    width: "5%",
    textAlign: "center",
  },
  colImage: {
    width: "15%",
    textAlign: "center",
  },
  colDesc: {
    width: "40%",
    textAlign: "left",
  },
  colPrice: {
    width: "15%",
    textAlign: "right",
  },
  colQty: {
    width: "10%",
    textAlign: "center",
  },
  colAmount: {
    width: "15%",
    textAlign: "right",
  },
  image: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
    fontSize: 10,
  },
});

// Invoice document component
const InvoiceDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.invoiceTitle}>INVOICE</Text>

      <View style={styles.header}>
        <View style={styles.shopInfo}>
          <Text>Your Shop Name</Text>
          <Text>Lucknow, UP - 226001</Text>
          <Text>support@yourshop.com</Text>
          <Text>+91 98765 43210</Text>
        </View>

        <View style={styles.orderInfo}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Order ID: </Text>
            {order._id}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Date: </Text>
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Payment: </Text>COD
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Status: </Text>
            {order.orderStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.billTo}>
        <Text style={styles.billTitle}>Bill To:</Text>
        <Text>{order.user?.name || "Samar Malik"}</Text>
        <Text>{order.user?.email || "samarakhlaqwarsi@gmail.com"}</Text>
        <Text>
          {order.shippingAddress?.address || "N/A"}, {order.shippingAddress?.city || "Lucknow"},{" "}
          {order.shippingAddress?.state || "Uttar Pradesh"} - {order.shippingAddress?.pincode || "226001"}
        </Text>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.colNum]}>#</Text>
          <Text style={[styles.tableCell, styles.colImage]}>Image</Text>
          <Text style={[styles.tableCell, styles.colDesc]}>Description</Text>
          <Text style={[styles.tableCell, styles.colPrice]}>Price (Rs.)</Text>
          <Text style={[styles.tableCell, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableCell, styles.colAmount]}>Amount (Rs.)</Text>
        </View>

        {/* Table Body */}
        {order.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colNum]}>{i + 1}</Text>
            <View style={[styles.tableCell, styles.colImage]}>
              <Image
                src={`https://esitebackend.onrender.com${item.featuredImage}`}
                
                style={styles.image}
                alt={item.title}
              />
            </View>
            <Text style={[styles.tableCell, styles.colDesc]}>{item.title}</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              {item.price.toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.colAmount]}>
              {(item.price * item.quantity).toLocaleString("en-IN")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>Rs. {order.totalAmount.toLocaleString("en-IN")}</Text>
      </View>

      <Text style={styles.footer}>Thank you for shopping with us!</Text>
    </Page>
  </Document>
);

// Main component to render download button with Tailwind + Lucide icon
export default function InvoiceDownload({ order }) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument order={order} />}
      fileName={`Invoice_${order._id || "order"}.pdf`}
    >
      {({ loading }) => (
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
          disabled={loading}
        >
          <Download size={18} />
          {loading ? "Preparing invoice..." : "Download Invoice PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
