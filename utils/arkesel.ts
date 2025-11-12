import axios from "axios";

export const sendArkeselSMS = async (
  recipients: string[],
  message: string,
  scheduledFor?: Date
) => {
  const apiKey = process.env.ARKESEL_API_KEY;
  const senderId = "CAW-HO"; // Replace with your approved SenderID

  const params: any = {
    api_key: apiKey,
    to: recipients.join(","), // comma-separated numbers
    from: senderId,
    sms: message,
  };

  if (scheduledFor) {
    // Format as YYYY-MM-DD HH:mm (Arkesel schedule format)
    const year = scheduledFor.getFullYear();
    const month = String(scheduledFor.getMonth() + 1).padStart(2, "0");
    const day = String(scheduledFor.getDate()).padStart(2, "0");
    const hours = String(scheduledFor.getHours()).padStart(2, "0");
    const minutes = String(scheduledFor.getMinutes()).padStart(2, "0");
    params.schedule = `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const url = "https://sms.arkesel.com/sms/api";

  try {
    const response = await axios.get(url, { params });
    if (response.data.includes("success")) {
      return response.data;
    } else {
      throw new Error(JSON.stringify(response.data));
    }
  } catch (err: any) {
    console.error("Arkesel SMS Error:", err.response?.data || err.message);
    throw new Error("Failed to send SMS via Arkesel");
  }
};
