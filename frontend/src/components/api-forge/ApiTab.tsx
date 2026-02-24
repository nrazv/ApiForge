import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Zap } from "lucide-react";

export default function ApiTab() {
    return (
        <TabsContent value="api" className="mt-4">
            <div className="h-[56px]"></div>
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Zap className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No API yet.</p>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
