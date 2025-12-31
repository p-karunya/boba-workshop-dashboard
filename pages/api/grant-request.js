export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventCode, organizerName, organizerEmail, amount, approvedCount, paymentMethod, additionalInfo } = req.body;
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!eventCode || !organizerName || !organizerEmail || !amount || !approvedCount || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Send Slack notification if webhook URL is configured
  if (slackWebhookUrl) {
    try {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🧋 New Boba Grant Request",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Event Code:*\n${eventCode}`
            },
            {
              type: "mrkdwn",
              text: `*Total Amount:*\n$${amount}`
            },
            {
              type: "mrkdwn",
              text: `*Organizer:*\n${organizerName}`
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${organizerEmail}`
            },
            {
              type: "mrkdwn",
              text: `*Approved Submissions:*\n${approvedCount} × $5`
            },
            {
              type: "mrkdwn",
              text: `*Payment Method:*\n${paymentMethod}`
            }
          ]
        }
      ];

      if (additionalInfo) {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Additional Info:*\n${additionalInfo}`
          }
        });
      }

      blocks.push({
        type: "divider"
      });

      const slackMessage = { blocks };

      const slackResponse = await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      });

      if (!slackResponse.ok) {
        console.error('Failed to send Slack notification:', await slackResponse.text());
        return res.status(500).json({ error: 'Failed to send Slack notification' });
      }

      return res.status(200).json({
        success: true,
        message: 'Grant request submitted successfully',
        requestedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  } else {
    // If no Slack webhook is configured, still accept the request
    console.log('Grant request received (no Slack webhook configured):', {
      eventCode,
      organizerName,
      organizerEmail,
      amount,
      reason,
    });
    return res.status(200).json({
      success: true,
      message: 'Grant request received (Slack notifications not configured)'
    });
  }
}
