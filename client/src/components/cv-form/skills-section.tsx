import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVForm } from "./form-context";

export function SkillsSection() {
  const { formData, updateArrayField } = useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Skills
      </h3>

      <div>
        <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
          Skills (Technical, Soft, Leadership)
        </Label>
        <Input
          id="skills"
          value={
            Array.isArray(formData.skills) ? formData.skills.join(", ") : ""
          }
          onChange={(e) => updateArrayField("skills", e.target.value)}
          className="mt-2"
          placeholder="Comma-separated skills (e.g., JavaScript, React, Python)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple skills with commas
        </p>
      </div>
    </div>
  );
}
