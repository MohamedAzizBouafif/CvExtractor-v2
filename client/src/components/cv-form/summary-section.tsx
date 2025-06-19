import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCVForm } from "./form-context";

export function SummarySection() {
  const { formData, updateField } = useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Professional Summary
      </h3>

      <div>
        <Label htmlFor="summary" className="text-sm font-medium text-gray-700">
          Elevator Pitch
        </Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          rows={4}
          className="mt-2 resize-none"
          placeholder="Brief professional summary..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Provide a brief overview of your professional background and key
          strengths
        </p>
      </div>
    </div>
  );
}
