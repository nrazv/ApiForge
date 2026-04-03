import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Database } from "lucide-react";

export default function SeedTab() {
    return (
        <TabsContent value="seed" className="mt-4">
            <div className="h-[56px]"></div>
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Database className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Seed data is coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
