import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCVForm } from "./form-context";

export function PersonalSection() {
  const { formData, updateField, updateArrayField } = useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
            className="mt-2"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
            className="mt-2"
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sex */}
        <div>
          <Label htmlFor="sex" className="text-sm font-medium text-gray-700">
            Sex
          </Label>
          <Select
            value={formData.sex}
            onValueChange={(value) => updateField("sex", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div>
          <Label
            htmlFor="language"
            className="text-sm font-medium text-gray-700"
          >
            Languages
          </Label>
          <Input
            id="language"
            value={
              Array.isArray(formData.language)
                ? formData.language.join(", ")
                : ""
            }
            onChange={(e) => updateArrayField("language", e.target.value)}
            className="mt-2"
            placeholder="Languages (comma separated)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div>
          <Label
            htmlFor="location"
            className="text-sm font-medium text-gray-700"
          >
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            className="mt-2"
            placeholder="City, Country"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <Label
            htmlFor="linkedin"
            className="text-sm font-medium text-gray-700"
          >
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => updateField("linkedin", e.target.value)}
            className="mt-2"
            placeholder="LinkedIn URL"
          />
        </div>
      </div>
    </div>
  );
}
