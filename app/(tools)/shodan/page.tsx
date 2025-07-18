import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function ShodanPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain & IP Intelligence</CardTitle>
        <CardDescription>This tool is currently under development.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
        <Construction className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Coming Soon</p>
        <p>Advanced domain and IP analysis will be available here.</p>
      </CardContent>
    </Card>
  );
}
