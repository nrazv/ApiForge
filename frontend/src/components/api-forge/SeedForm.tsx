import { ApiModelDefinition } from "@/types/modeldefinition/ApiModelDefinition";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  definition: ApiModelDefinition;
};

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

export default function SeedForm(prop: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      recordFields: prop.definition.fields.map((field) => ({
        name: field.name,
        value: formData[field.name] || "",
      })),
    };

    try {
    const response =   await fetch(`${apiBase}/api/${prop.definition.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    if (response.ok) {
      setFormData({});
    }
    } catch (error) {
      console.error("Failed to create resource:", error);
    }
  };

  return (
    <div className="my-10">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {prop.definition.name.toLocaleUpperCase()}
      </h4>

      <form
        className="grid w-full items-center gap-4 mt-4"
        onSubmit={handleSubmit}
      >
        {prop.definition.fields.map((f) => (
          <div key={f.name} className="grid gap-2">
            <Label>{f.name}</Label>

            <Input
              value={formData[f.name] || ""}
              onChange={(e) => handleChange(f.name, e.target.value)}
              placeholder={`Enter ${f.name}`}
              className="font-mono"
              required
            />
          </div>
        ))}

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Resource
        </Button>
      </form>
    </div>
  );
}

{
  /* { prop.definition.fields.map((field) =>
            ( <> 
                        <Label>{field.name}</Label>
                           <Input
                             value={''}
                             placeholder="field_name"
                             className="font-mono"
                             required
                           />   
          </>
          )  
        } */
}
