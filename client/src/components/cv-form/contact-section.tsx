import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVForm } from "./form-context";

export function ContactSection() {
  const { formData, handleInputChange, handleArrayInputChange } = useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Contact Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="mt-2"
            placeholder="email@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Numbers
          </Label>
          <Input
            id="phone"
            type="tel"
            value={
              Array.isArray(formData.phone) ? formData.phone.join(", ") : ""
            }
            onChange={(e) => handleArrayInputChange("phone", e.target.value)}
            className="mt-2"
            placeholder="Phone numbers (comma separated)"
          />
        </div>
      </div>
    </div>
  );
}
