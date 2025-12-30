import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Box } from "theme-ui";

export default function Event() {
  const { data: session, status } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawResponse, setRawResponse] = useState(null);
  const StatusKey = {
    Pending: "yellow",
    Approved: "green",
    Rejected: "red",
  };

  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || !router.isReady) return;
    if (status !== "authenticated") return;
    const code = router.query.EventCode;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/websites/${encodeURIComponent(code)}`);
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.error || `Request failed: ${res.status}`);
        setRawResponse(json.raw ?? json);
        setRows(json.records || []);
      } catch (err) {
        console.error("Error fetching event data", err);
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, router.isReady, router.query.EventCode]);

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }
  if (status !== "authenticated") {
    return null;
  }

  return (
    <Layout>
      <Header
        session={session}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      <Box sx={{ px: 4 }}>
        <Box
          as="p"
          sx={{
            mt: [2, 3], // space after header
            mb: [3, 4], // space before table
            textAlign: "center",
            color: "primary",
            fontSize: [2, 3], // smaller than a title
            fontWeight: 500,
            lineHeight: "heading",
            opacity: 0.85, // makes it feel secondary
          }}
        >
          Event Code: {router.query.EventCode}
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#0a0f1c",
              color: "#f8fbff",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "rgba(255,255,255,0.06)" }}>
              <tr>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>
                  Name
                </th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>
                  Email
                </th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>
                  Status
                </th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>
                  Website
                </th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>
                  Decision Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td style={{ padding: "12px 16px" }} colSpan={5}>
                    Loading...
                  </td>
                </tr>
              )}
              {error && !loading && (
                <tr>
                  <td
                    style={{ padding: "12px 16px", color: "#EC3750" }}
                    colSpan={5}
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td style={{ padding: "12px 16px" }} colSpan={5}>
                    No records found.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                rows.map((row, idx) => (
                  <tr
                    key={`${row.email}-${idx}`}
                    style={{
                      borderTop: "1px solid rgba(248, 251, 255, 0.08)",
                      background:
                        idx % 2 === 0
                          ? "rgba(255,255,255,0.02)"
                          : "transparent",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>{row.name}</td>
                    <td style={{ padding: "12px 16px" }}>{row.email}</td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        color: StatusKey[row.status],
                      }}
                    >
                      {row.status}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <a
                        href={row.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#5BC0EB" }}
                      >
                        {row.website}
                      </a>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {row.decisionReason}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </Box>
      <Footer />
    </Layout>
  );
}
