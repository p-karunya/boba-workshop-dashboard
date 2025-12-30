export default async function handler(req, res) {
  const { SlackID } = req.query;
  const key = process.env.AIRBRIDGE_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing AIRBRIDGE_API_KEY" });
  if (!SlackID) return res.status(400).json({ error: "Missing SlackID" });

  try {
    const select = encodeURIComponent(
      JSON.stringify({
        fields: ["Event Code", "Status", "Organizer Name"],
        filterByFormula: `{Slack ID} = '${SlackID}'`,
      })
    );
    const base = encodeURIComponent("Boba Club Dashboard");
    const url = `https://airbridge.hackclub.com/v0.2/${base}/Event Codes?select=${select}&authKey=${key}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let resp;
    try {
      resp = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        return res
          .status(504)
          .json({ error: "Upstream request timed out after 8s" });
      }
      throw err;
    }
    clearTimeout(timeout);

    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return res
        .status(502)
        .json({ error: "Bad JSON from upstream", body: text });
    }

    if (!resp.ok) {
      return res
        .status(resp.status)
        .json({ error: "Upstream error", body: json });
    }

    const records = Array.isArray(json)
      ? json
      : json?.records || json?.data || [];

    const normalized = records.map((r) => {
      const fields = r.fields || r;
      return {
        id: r.id || fields.id || null,
        code: fields["Event Code"] || fields.code || "",
        status: fields.Status || fields.status || "Pending",
      };
    });

    return res.status(200).json({ records: normalized, raw: json });
  } catch (err) {
    console.error("Event codes fetch error", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
