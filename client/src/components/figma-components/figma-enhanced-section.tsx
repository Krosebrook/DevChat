import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FigmaEnhancedSection() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Enhanced Features
        </h2>
        <p className="text-slate-600">
          New design from Figma integration
        </p>
      </div>
      
      {/* PASTE YOUR FIGMA CODE HERE AND I'LL CONVERT IT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Feature 1</CardTitle>
            <CardDescription>From Figma design</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}