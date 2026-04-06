import { ApiModelDefinition } from "@/types/modeldefinition/ApiModelDefinition";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

type Props = {
  apiModel: ApiModelDefinition;
};

const ApiDetails = ({ apiModel }: Props) => {
  return (
    <Card className="mt-5">
      <CardContent className="flex flex-col py-5">
        <p className="text-muted-foreground">{apiModel.name}</p>
        <div className="mt-4">
          <h6>[GET] Get All</h6>
          <p className="text-muted-foreground pt-2">
            {apiBase}/api/{apiModel.name}
          </p>
        </div>

        <div className="mt-4">
          <h6>[POST] Create New</h6>
          <p className="text-muted-foreground pt-2">
            {apiBase}/api/{apiModel.name}
          </p>
        </div>

        <div className="mt-4">
          <h6>[PATCH] Create New</h6>
          <p className="text-muted-foreground pt-2">
            {apiBase}/api/{apiModel.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDetails;
