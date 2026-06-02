import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ApiModelDefinition } from "@/types/modeldefinition/ApiModelDefinition";
import { Database } from "lucide-react";
import SeedForm from "./SeedForm";

type Props = {
  projectApis: ApiModelDefinition[];
};

export default function SeedTab({ projectApis }: Props) {
  
  return (
    <TabsContent value="seed" className="mt-4">
     {projectApis.length <= 0 ? (
        <>
        <div className="h-[56px]"></div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">Seed data is coming soon.</p>
          </CardContent>
        </Card>
        </>
     ):  
      (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
          {
            projectApis.map((api) => (
              <SeedForm key={api.id} definition={api} />
            ))
          }
          </CardContent>
        </Card>)}
    </TabsContent>
  );
}
