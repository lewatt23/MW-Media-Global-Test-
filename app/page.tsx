"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2, Download, RefreshCw, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImages = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setSelectedImage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate images");
      }

      const data = await response.json();
      setImages(data.images);

      toast({
        title: "Images generated",
        description: "Select your favorite image from the options below.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const regenerateVariations = async () => {
    if (!selectedImage) return;

    setLoading(true);

    try {
      const response = await fetch("/api/variations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate variations");
      }

      const data = await response.json();
      setImages(data.images);
      setSelectedImage(null);

      toast({
        title: "New variations generated",
        description: "Select your favorite image from the new options.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const downloadImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const downloadUrl = `/api/download?imageUrl=${encodeURIComponent(
        selectedImage
      )}`;

      const link = document.createElement("a");
      link.href = downloadUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Error",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            AI Image Generator
          </CardTitle>
          <CardDescription className="text-center">
            Generate custom images from text descriptions using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-medium">Enter your prompt</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="E.g., A serene landscape with mountains at sunset, digital art style"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={generateImages}
              disabled={loading || !prompt.trim()}
              className="sm:w-auto w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && images.length === 0 && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Creating your images...</p>
          </CardContent>
        </Card>
      )}

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedImage ? "Selected Image" : "Generated Images"}
            </CardTitle>
            <CardDescription>
              {selectedImage
                ? "You can download this image or generate new variations"
                : "Click on an image to select it"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImage === image
                      ? "ring-2 ring-offset-2 ring-primary scale-[1.02]"
                      : "hover:opacity-90"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg?height=512&width=512"}
                    alt={`Generated image ${
                      index + 1
                    } based on prompt: ${prompt}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 2}
                  />
                </div>
              ))}
            </div>

            {selectedImage && (
              <>
                <Separator className="my-4" />
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={downloadImage}
                    className="flex-1 sm:flex-initial"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={regenerateVariations}
                    className="flex-1 sm:flex-initial"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Variations
                  </Button>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex-col">
            <Separator className="my-4" />
            <div className="w-full space-y-2">
              <h3 className="font-medium">Tips for better results:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Be specific about what you want to see in the image</li>
                <li>
                  Mention art styles like "watercolor", "digital art", or
                  "photorealistic"
                </li>
                <li>Include details about lighting, colors, and composition</li>
                <li>
                  Try different prompts if you're not satisfied with the results
                </li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
