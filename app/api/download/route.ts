import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");

  if (!imageUrl || typeof imageUrl !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid imageUrl parameter" },
      { status: 400 }
    );
  }

  try {
    const parsedUrl = new URL(imageUrl);
    if (!parsedUrl.hostname.endsWith("blob.core.windows.net")) {
      console.warn(
        "Potential misuse: URL does not seem to be from Azure Blob:",
        imageUrl
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid URL format provided" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(imageUrl, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch image from source:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    const imageStream = response.body;

    const headers = new Headers();
    const filename = `generated-image-${Date.now()}.png`;
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set(
      "Content-Type",
      response.headers.get("content-type") || "image/png"
    );
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new Response(imageStream, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error occurred while downloading image." },
      { status: 500 }
    );
  }
}
