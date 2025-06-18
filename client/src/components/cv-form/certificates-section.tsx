import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVForm } from "./form-context";

export function CertificatesSection() {
  const { formData, handleArrayInputChange } = useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Certificates
      </h3>

      <div>
        <Label
          htmlFor="certificates"
          className="text-sm font-medium text-gray-700"
        >
          Certificates & Certifications
        </Label>
        <Input
          id="certificates"
          value={
            Array.isArray(formData.certificates)
              ? formData.certificates.join(", ")
              : ""
          }
          onChange={(e) =>
            handleArrayInputChange("certificates", e.target.value)
          }
          className="mt-2"
          placeholder="Comma-separated certificates"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple certificates with commas
        </p>
      </div>
    </div>
  );
}
