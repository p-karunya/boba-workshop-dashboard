import { Box, Grid, Text } from "theme-ui";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import WorkshopCard from "../components/workshopCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/event-codes/by-owner?SlackID=${encodeURIComponent(
            session.user.SlackID
          )}`
        );
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.error || `Request failed: ${res.status}`);
        setEvents(json.records || []);
      } catch (err) {
        setError(err?.message || "Failed to load your workshops");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [status, session]);

  return (
    <Layout
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
        px: [3, 4, 5],
        py: [3, 4, 5],
        gap: [4, 5],
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      }}
    >
      <Header
        session={session}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      <Box
        sx={{
          textAlign: "center",
          p: [2, 3],
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "background",
          borderRadius: 4,
          gap: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          width: "100%",
        }}
      >
        {status === "loading" && <Text>Loading...</Text>}
        {status === "unauthenticated" && <Text>Redirecting to sign in...</Text>}
        {status === "authenticated" && (
          <>
            {loading && <Text>Loading your workshops...</Text>}
            {error && !loading && <Text sx={{ color: "accent" }}>{error}</Text>}
            {!loading && !error && events.length === 0 && (
              <Text>No workshops found for your account.</Text>
            )}
            {!loading && !error && events.length > 0 && (
              <Grid
                color={[2, 3]}
                gap={3}
                columns={[1]}
                sx={{
                  placeItems: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "100%",
                  mx: "auto",
                }}
              >
                {events.map((ev) => (
                  <WorkshopCard
                    key={ev.id || ev.code}
                    Eventcode={ev.code}
                    EventStatus={ev.status || "Pending"}
                  />
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
      <Footer />
    </Layout>
  );
}
