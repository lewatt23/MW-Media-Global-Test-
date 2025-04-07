import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Loading</CardTitle>
          <CardDescription className="text-center">Preparing your image generator</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        </CardContent>
      </Card>
    </div>
  )
}

