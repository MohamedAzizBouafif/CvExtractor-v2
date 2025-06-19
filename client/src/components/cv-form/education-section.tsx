import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useCVForm, useCVFormActions } from "./form-context";

export function EducationSection() {  const { formData, updateNestedField } = useCVForm();
  const { addEducation, removeEducation } = useCVFormActions();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Education
      </h3>

      <div className="space-y-4">
        {formData.education.map((edu, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor={`degree-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Degree
                </Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) =>
                    updateNestedField("education", index, "degree", e.target.value)
                  }
                  className="mt-2"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>
              <div>
                <Label
                  htmlFor={`institution-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Institution
                </Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) =>
                    updateNestedField("education", index, "institution", e.target.value)
                  }
                  className="mt-2"
                  placeholder="University name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label
                  htmlFor={`location-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                </Label>
                <Input
                  id={`location-${index}`}
                  value={edu.location}
                  onChange={(e) =>
                    updateNestedField("education", index, "location", e.target.value)
                  }
                  className="mt-2"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label
                  htmlFor={`start-date-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Start Date
                </Label>
                <Input
                  id={`start-date-${index}`}
                  value={edu.start_date}
                  onChange={(e) =>
                    updateNestedField("education", index, "start_date", e.target.value)
                  }
                  className="mt-2"
                  placeholder="e.g., Sep 2018"
                />
              </div>
              <div>
                <Label
                  htmlFor={`end-date-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  End Date
                </Label>
                <Input
                  id={`end-date-${index}`}
                  value={edu.end_date}
                  onChange={(e) =>
                    updateNestedField("education", index, "end_date", e.target.value)
                  }
                  className="mt-2"
                  placeholder="e.g., Jun 2022 or Present"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(index)}
              className="mt-3 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Education
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={addEducation}
        className="flex items-center space-x-2 text-primary hover:text-primary/80"
      >
        <Plus className="w-4 h-4" />
        <span>Add Education</span>
      </Button>
    </div>
  );
}
