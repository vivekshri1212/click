const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "frontend_store";

let db = null;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

async function connectToMongo() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`MongoDB connected: ${DB_NAME}`);
}

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        database: db ? "connected" : "disconnected"
    });
});

app.post("/api/cart/save", async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({
                ok: false,
                message: "Database not connected yet."
            });
        }

        const items = Array.isArray(req.body.items) ? req.body.items : [];
        const total = Number(req.body.total || 0);

        if (!items.length) {
            return res.status(400).json({
                ok: false,
                message: "Cart is empty."
            });
        }

        const result = await db.collection("carts").insertOne({
            items,
            total,
            createdAt: new Date()
        });

        res.json({
            ok: true,
            insertedId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Failed to save cart.",
            error: error.message
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

connectToMongo()
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    })
    .finally(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    });
