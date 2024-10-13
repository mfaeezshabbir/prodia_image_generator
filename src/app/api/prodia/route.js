// pages/api/prodia.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { prompt } = await req.json();

    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "X-Prodia-Key": process.env.PRODIA_API_KEY,
        },
        body: JSON.stringify({ prompt }),
    };

    try {
        const response = await fetch("https://api.prodia.com/v1/sdxl/generate", options);
        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error during image generation:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.prodia.com/v1/job/${jobId}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Prodia-Key": process.env.PRODIA_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error during status check:", error);
        return NextResponse.json({ error: "Failed to check job status" }, { status: 500 });
    }
}