import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ApiModelDefinition } from "@/types/modeldefinition/ApiModelDefinition";
import { Zap } from "lucide-react";
import ApiDetails from "../ApiDetails";

type Props = {
  projectApis: ApiModelDefinition[];
};

export default function ApiTab({ projectApis }: Props) {
  return (
    <TabsContent value="api" className="mt-4">
      {projectApis.length <= 0 && NoApiMessage()}
      {projectApis.length > 0 &&
        projectApis.map((p, key) => <ApiDetails apiModel={p} key={key} />)}
    </TabsContent>
  );

  function NoApiMessage() {
    return (
      <>
        <div className="h-[56px]"></div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No API yet.</p>
          </CardContent>
        </Card>
      </>
    );
  }
}
