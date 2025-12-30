import { Box, Text } from "theme-ui";
import { useRouter } from "next/router";
const randomPatternUrls = [
  "https://images.unsplash.com/photo-1557683304-673a23048d34?fm=jpg",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?fm=jpg",
  "https://images.unsplash.com/photo-1557683316-973673baf926?fm=jpg",
];
export default function WorkshopCard(props) {
  const { Eventcode, EventStatus } = props;
  const backgroundImage =
    randomPatternUrls[Math.floor(Math.random() * randomPatternUrls.length)];
  const router = useRouter();

  const handleNavigate = () => {
    const target = `/event/${encodeURIComponent(Eventcode || "")}`;
    router.push(target);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: [200, 220],
          width: "100%",
          maxWidth: "100%",
          borderRadius: 12,
          p: [3, 4],
          color: "foreground",
          fontWeight: "bold",
          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 3,
          mx: "auto",
          position: "relative",
          overflow: "hidden",
          background: "transparent",
          "&::before": {
            content: "''",
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(0px)",
            transition: "filter 200ms ease, transform 200ms ease",
            transform: "scale(1.02)",
            zIndex: 0,
          },
          transition: "transform 200ms ease, box-shadow 200ms ease",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
            transform: "translateY(-4px) scale(1.01)",
            "&::before": {
              filter: "blur(0px)",
              transform: "scale(1.50)",
            },
          },
          borderWidth: 8,
          borderColor: "primary",
          cursor: "pointer",
        }}
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
      >
        <Text
          sx={{
            fontSize: [20, 22],
            ml: 1,
            alignSelf: "flex-start",
            zIndex: 3,
          }}
        >
          {Eventcode}
        </Text>
        <Box
          sx={{
            color: "text",
            px: [3, 4],
            py: [2, 2],
            borderRadius: 999,
            fontSize: [16, 18],
            fontWeight: "bold",
            boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            zIndex: 3,
          }}
        >
          {EventStatus}
        </Box>
      </Box>
    </>
  );
}
