import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Valid image URL is required" },
        { status: 400 }
      );
    }

    // 1. Download the image from the URL
    const responses = await fetch(image);
    if (!responses.ok) {
      throw new Error(`Failed to fetch image: ${responses.statusText}`);
    }

    const imageBlob = await responses.blob();

    const imageFile = new File([imageBlob], "image.png", {
      type: imageBlob.type,
    });

    const response = await openai.images.createVariation({
      model: "dall-e-2",
      image: imageFile,
      n: 4,
      size: "1024x1024",
    });

    // Extract image URLs from the response
    const imageUrls = response.data.map((image) => image.url || "");

    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error("Error generating image variations:", error);
    return NextResponse.json(
      { error: "Failed to generate image variations" },
      { status: 500 }
    );
  }
}
