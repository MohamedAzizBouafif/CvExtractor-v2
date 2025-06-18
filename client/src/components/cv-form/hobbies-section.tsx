import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVForm } from "./form-context";

export function HobbiesSection() {
  const { formData, handleArrayInputChange } = useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Hobbies & Interests
      </h3>

      <div>
        <Label htmlFor="hobbies" className="text-sm font-medium text-gray-700">
          Hobbies
        </Label>
        <Input
          id="hobbies"
          value={
            Array.isArray(formData.hobbies) ? formData.hobbies.join(", ") : ""
          }
          onChange={(e) => handleArrayInputChange("hobbies", e.target.value)}
          className="mt-2"
          placeholder="Comma-separated hobbies"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple hobbies with commas
        </p>
      </div>
    </div>
  );
}
