import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

const resend = new Resend(process.env.RESEND_API_KEY);
app.use(cors());
app.use(bodyParser.json());

app.get("/api/v1/hello", (req, res) => {
    console.log("hello");
    res.send('Hello from the backend!');
});

app.post("/api/v1/sendemail", async (req, res) => {
  const { uuid } = req.body;
  console.log(uuid);
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <user@resend.dev>",
      to: ["serrialerror@outlook.com"],
      subject: "hello world",
      html: `<strong>it works, ${uuid}</strong>`,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
